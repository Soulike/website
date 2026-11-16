import {
  isObjectEmpty,
  removeUndefinedFieldsShallow,
} from '@library/object-helpers';
import {
  type AccountInsertRow,
  AccountInsertRowSchema,
  type AccountRow,
  AccountRowSchema,
  type AccountUpdateRow,
  type OrderConfig,
} from '@schema/database';

import {createEntityKeyMap, sortEntities} from './fake-table-helpers.js';

const ACCOUNT_KEYS = AccountRowSchema.keyof().options;
const ACCOUNT_KEY_MAP = createEntityKeyMap<AccountRow>(ACCOUNT_KEYS);

function matchesAccountFilter(
  row: AccountRow,
  filter: Partial<AccountRow>,
): boolean {
  return Object.entries(filter).every(([key, value]) => {
    const typedKey = ACCOUNT_KEY_MAP.get(key);
    return typedKey !== undefined && row[typedKey] === value;
  });
}

export class FakeUserTable {
  private static accounts: AccountRow[] = [];

  static reset(): void {
    this.accounts = [];
  }

  static async insert(account: AccountInsertRow): Promise<void> {
    const newAccount = AccountInsertRowSchema.parse(account);
    await Promise.resolve();
    this.accounts.push(newAccount);
  }

  static async deleteByUsername(
    username: AccountRow['username'],
  ): Promise<void> {
    await Promise.resolve();
    this.accounts = this.accounts.filter(
      (account) => account.username !== username,
    );
  }

  static async updateByUsername(
    username: AccountRow['username'],
    account: AccountUpdateRow,
  ): Promise<void> {
    const filteredAccount = removeUndefinedFieldsShallow(account);
    if (isObjectEmpty(filteredAccount)) {
      return;
    }

    const existingAccount = this.accounts.find((a) => a.username === username);
    if (existingAccount !== undefined) {
      await Promise.resolve();
      Object.assign(existingAccount, filteredAccount);
    }
  }

  static async selectByUsername(
    username: AccountRow['username'],
  ): Promise<AccountRow | null> {
    const account = this.accounts.find((a) => a.username === username);
    await Promise.resolve();
    return account ? AccountRowSchema.parse(account) : null;
  }

  static async selectAll(
    orderConfig: OrderConfig<AccountRow> = {},
  ): Promise<AccountRow[]> {
    return this.select({}, orderConfig);
  }

  static async select(
    account: Partial<AccountRow>,
    orderConfig: OrderConfig<AccountRow> = {},
  ): Promise<AccountRow[]> {
    if (isObjectEmpty(account)) {
      return this.sortAccounts([...this.accounts], orderConfig);
    }

    const filteredAccounts = this.accounts.filter((a) =>
      matchesAccountFilter(a, account),
    );

    await Promise.resolve();
    return this.sortAccounts(filteredAccounts, orderConfig);
  }

  static async countAll(): Promise<number> {
    await Promise.resolve();
    return this.accounts.length;
  }

  static async count(account: Partial<AccountRow>): Promise<number> {
    if (isObjectEmpty(account)) {
      return this.countAll();
    }

    const filteredAccounts = this.accounts.filter((a) =>
      matchesAccountFilter(a, account),
    );

    return filteredAccounts.length;
  }

  private static sortAccounts(
    accounts: AccountRow[],
    orderConfig: OrderConfig<AccountRow>,
  ): AccountRow[] {
    const sortedAccounts = sortEntities(accounts, orderConfig, ACCOUNT_KEYS);
    return sortedAccounts.map((account) => AccountRowSchema.parse(account));
  }
}
