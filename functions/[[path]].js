export async function onRequest(context) {
  const { request, params } = context;
  if (!params.path || params.path.length === 0) {
    return new Response(
      `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8" />
    <title>CodemaoAPI_CFProxy</title>
    <style>
        html,
        body {
            height: 100%;
            margin: 0;
        }
        body {
            display: flex;
            justify-content: center;
            /* 水平居中 */
            align-items: center;
            /* 垂直居中 */
        }
    </style>
</head>
<body>
    <div style="text-align: center;">
        <img src="https://s3.bmp.ovh/imgs/2024/10/25/7cd326afa68c3c6a.png" width="162" height="213.2" alt="言叶大魔王">
        <h2>早上好~Sensei~</h2>
        <b>这是一个在Cloudflare上反向代理的编程猫API服务，这里是默认页面</b>
        <p>使用方法：只需要把 api.codemao.cn 部分换成这个域名就好</p>
        <p>公共服务，无任何记录行为。如果需要自己部署，请查看GitHub仓库，里面还有更详细的说明</p>
        <a href="https://github.com/Wangs-official/CodemaoAPI_CFProxy">点击此处前往GitHub仓库，记得Star!</a>
    </div>
</body>
</html>`,
      {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      }
    );
  }
  const targetBase = "https://api.codemao.cn";
  const incomingUrl = new URL(request.url);

  const targetUrl = new URL(
    `${targetBase}/${params.path.join("/")}`
  );
  targetUrl.search = incomingUrl.search;
  const proxyRequest = new Request(targetUrl.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: "manual",
  });
  const response = await fetch(proxyRequest);
  const newHeaders = new Headers(response.headers);
  newHeaders.delete("content-encoding");
  newHeaders.delete("content-length");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
