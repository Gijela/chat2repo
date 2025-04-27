import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query_id } = await request.json();

    if (!query_id) {
      return NextResponse.json(
        { error: 'query_id is required' },
        { status: 400 },
      );
    }

    // 轮训获取
    let data: { isDone: boolean; content: string } = {
      isDone: false,
      content: '',
    };
    let retryCount = 0;
    const maxRetries = 30; // 最多重试30次
    const retryInterval = 1500; // 每次重试间隔1秒

    while (retryCount < maxRetries) {
      data = await getMarkdownData(query_id);

      if (data.isDone) {
        break;
      }

      // 等待一段时间后重试
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
      retryCount++;
    }

    if (!data.isDone) {
      return NextResponse.json(
        { success: false, data, error: 'Response timeout' },
        { status: 408 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}

const getMarkdownData = async (query_id: string) => {
  // --- 获取外部 API 的流 ---
  const response = await fetch(`https://api.devin.ai/ada/query/${query_id}`, {
    method: 'GET',
    headers: {
      accept: 'application/json', // 或者可能是 text/event-stream，取决于 devin.ai 返回什么
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'cache-control': 'no-cache',
      origin: 'https://deepwiki.com',
      pragma: 'no-cache',
      referer: 'https://deepwiki.com/',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
    },
  });

  const data = await response.json();
  // 获取最后一个查询
  const lastItem = data.queries?.[data.queries.length - 1];
  // 判断最后一个查询是否完成, 如果未完成则返回空字符串
  const isDone =
    lastItem?.response?.[lastItem?.response?.length - 1]?.type === 'done';
  if (!isDone) {
    return { isDone: false, content: '' };
  }

  // 获取最后一个查询的 markdown 数据
  let markdownData = '';
  lastItem.response.forEach((item: any) => {
    if (item.type === 'chunk') {
      markdownData += item.data;
    }
  });
  return { isDone: true, content: markdownData };
};
