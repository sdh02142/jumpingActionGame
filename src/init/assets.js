import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let gameAssets = {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../assets')

// 파일 읽는 함수
// 비동기 병렬(여러 작업이 제각각의 처리시간이 소요되지만 가장 오래 걸리는 작업에 맞추어 모든 작업이 동시에 진행됨)로 파일을 읽음
const readFileAsync = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            };
            resolve(JSON.parse(data))
        });
    });
};

// Promise.all()
export const loadGameAssets = async () => {
    try {
        const [stages, items, itemUnlocks] = await Promise.all([
            readFileAsync('stage.json'),
            readFileAsync('item.json'),
            readFileAsync('item_unlock.json'),
        ]);

        gameAssets = { stages, items, itemUnlocks };
        return gameAssets;
    } catch (e) {
        throw new Error('Failed to load game assets: ' + e.message);
    };
};

export const getGameAssets = () => {
    return gameAssets;
}