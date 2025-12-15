import {type Client, type PoolClient} from 'pg';

import {Util} from '../Function/index.js';

export async function transaction<T extends Client | PoolClient>(
  client: T,
  transaction: (client: T) => Promise<any>,
): Promise<void> {
  try {
    await client.query('START TRANSACTION');
    await transaction(client); // 传入参数保证事务使用的是同一个 Client 实例
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  }
}

export function generateParameterizedStatementAndParametersArray(
  obj: Record<string, unknown>,
  connection: 'AND' | ',',
): {
  parameters: unknown[];
  parameterizedStatement: string;
} {
  obj = Util.removeUndefinedValuesFromObject(obj);
  const parameters: unknown[] = [];
  let parameterizedStatement = ''; // "a"=$1,"b"=$2
  Object.keys(obj).forEach((key, index) => {
    parameterizedStatement += `"${key}"=$${index + 1} ${connection} `;
    parameters.push(obj[key]);
  });
  return {
    parameters,
    parameterizedStatement: parameterizedStatement.slice(
      0,
      -1 * (connection.length + 2),
    ), // 删除末尾连接符号
  };
}
