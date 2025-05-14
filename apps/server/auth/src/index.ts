import Koa from 'koa';
import signale from 'signale';

const app = new Koa();
app.on('error', (e: unknown) => {
  if (e instanceof Error) {
    signale.error(
      `Uncaught error：\n${e.name}\n${e.message}\n${e.stack ?? ''}`,
    );
  } else {
    signale.error(`Uncaught error：\n${JSON.stringify(e)}`);
  }
});

app.use(async (ctx, next) => {
  ctx.response.body = 'hello world!';
  await next();
});

app.listen(3000);
