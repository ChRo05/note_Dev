// 過去記事ドリップ配信ボット
// data/backlog_queue.json の予約分（at <= 現在時刻）を X / Threads へ投稿。
// 既存の新着通知(index.js)とは独立し、state/backlog_posted.json で処理済みを管理する。
//
// 環境変数:
//   POST_TO_X       'false' で X をスキップ（既定: 投稿する）
//   POST_TO_THREADS 'false' で Threads をスキップ（既定: 投稿する）
//   MAX_PER_RUN     1回の実行で投稿する最大件数（既定: 3 = 取りこぼし追い付き用）
//   DRY_RUN         '1' で実際には投稿せず内容だけ表示
import fs from 'fs/promises';
import path from 'path';
import { postToX } from './x.js';
import { postToThreads } from './threads.js';

const QUEUE_PATH = path.resolve('data/backlog_queue.json');
const STATE_PATH = path.resolve('state/backlog_posted.json');

const POST_X = process.env.POST_TO_X !== 'false';
const POST_THREADS = process.env.POST_TO_THREADS !== 'false';
const MAX_PER_RUN = parseInt(process.env.MAX_PER_RUN || '3', 10);
const DRY_RUN = process.env.DRY_RUN === '1';

async function loadJson(p, fallback) {
    try { return JSON.parse(await fs.readFile(p, 'utf8')); }
    catch { return fallback; }
}

async function saveState(set) {
    await fs.mkdir(path.dirname(STATE_PATH), { recursive: true });
    await fs.writeFile(STATE_PATH, JSON.stringify([...set], null, 2) + '\n');
}

async function main() {
    const queue = await loadJson(QUEUE_PATH, []);
    const posted = new Set(await loadJson(STATE_PATH, []));
    const now = Date.now();

  const due = queue
        .filter(function (q) { return !posted.has(q.id); })
        .filter(function (q) { return new Date(q.at).getTime() <= now; })
        .sort(function (a, b) { return new Date(a.at) - new Date(b.at); })
        .slice(0, MAX_PER_RUN);

  if (due.length === 0) { console.log('No backlog items due'); return; }

  for (const item of due) {
        if (DRY_RUN) {
                console.log('[DRY] id=' + item.id + '\n' + item.text + '\n');
                posted.add(item.id);
                continue;
        }

    let anyOk = false;
        if (POST_X) {
                try {
                        const xId = await postToX(item.text);
                        console.log('X posted OK: id=' + item.id + ' (' + xId + ')');
                        anyOk = true;
                } catch (e) {
                        console.error('X post failed: id=' + item.id + ' - ' + e.message);
                }
        }
        if (POST_THREADS) {
                try {
                        const thId = await postToThreads(item.text);
                        console.log('Threads posted OK: id=' + item.id + ' (' + thId + ')');
                        anyOk = true;
                } catch (e) {
                        console.error('Threads post failed: id=' + item.id + ' - ' + e.message);
                }
        }

    // どちらかに投稿できたら処理済みにする（両方失敗した場合のみ次回リトライ）
        if (anyOk) {
                posted.add(item.id);
                await saveState(posted);
        } else {
                console.error('Both channels failed for id=' + item.id + ', will retry next run');
                break;
        }
  }

  if (DRY_RUN) { console.log('(dry-run: state not saved)'); return; }
    await saveState(posted);
    console.log('Backlog progress: ' + posted.size + '/' + queue.length + ' posted');
}

main().catch(function (e) { console.error(e); process.exit(1); });
