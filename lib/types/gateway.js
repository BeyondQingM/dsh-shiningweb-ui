var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
/**
 * dsh-shiningweb-ui 网关：ShiningService（Typert Remote 命名空间 `shining`）。
 * fs 方法（node:fs/promises）；git/chat 方法见 Task 4。
 */
import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { Context, Service } from '@deepseek-ai/cordis';
import s from '@deepseek-ai/schemastery';
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { failure, resolveWithinRoot, success } from "./types.js";
import { DEFAULT_SHINING_SETTINGS, SETTINGS_NAMESPACE } from "./settings.js";
import { ShiningSettingsSchema } from "./settings-schema.js";
import { createQqAdapter, createQqModelCall, ShiningQqService } from "./qq.js";
const execFileAsync = promisify(execFile);
/** 在 repo 目录执行 git 命令。 */
async function gitResult(repo, args) {
    const { stdout } = await execFileAsync('git', ['-C', repo, ...args], { timeout: 30000 });
    // Preserve leading spaces: porcelain status uses the first two columns as data.
    return stdout.replace(/\r?\n$/, '');
}
/** ShiningService：host 侧 Remote 网关。 */
let ShiningService = (() => {
    let _classSuper = TypertRemoteService;
    let _instanceExtraInitializers = [];
    let _fsList_decorators;
    let _fsRead_decorators;
    let _fsWrite_decorators;
    let _fsCreateFile_decorators;
    let _fsCreateDir_decorators;
    let _fsRename_decorators;
    let _fsDelete_decorators;
    let _gitStatus_decorators;
    let _gitCheckout_decorators;
    let _gitCreateBranch_decorators;
    let _gitPull_decorators;
    let _chat_decorators;
    let _qqList_decorators;
    let _qqRead_decorators;
    let _qqSend_decorators;
    return class ShiningService extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _fsList_decorators = [Remote('fsList')];
            _fsRead_decorators = [Remote('fsRead')];
            _fsWrite_decorators = [Remote('fsWrite')];
            _fsCreateFile_decorators = [Remote('fsCreateFile')];
            _fsCreateDir_decorators = [Remote('fsCreateDir')];
            _fsRename_decorators = [Remote('fsRename')];
            _fsDelete_decorators = [Remote('fsDelete')];
            _gitStatus_decorators = [Remote('gitStatus')];
            _gitCheckout_decorators = [Remote('gitCheckout')];
            _gitCreateBranch_decorators = [Remote('gitCreateBranch')];
            _gitPull_decorators = [Remote('gitPull')];
            _chat_decorators = [Remote('chat')];
            _qqList_decorators = [Remote('qqList')];
            _qqRead_decorators = [Remote('qqRead')];
            _qqSend_decorators = [Remote('qqSend')];
            __esDecorate(this, null, _fsList_decorators, { kind: "method", name: "fsList", static: false, private: false, access: { has: obj => "fsList" in obj, get: obj => obj.fsList }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _fsRead_decorators, { kind: "method", name: "fsRead", static: false, private: false, access: { has: obj => "fsRead" in obj, get: obj => obj.fsRead }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _fsWrite_decorators, { kind: "method", name: "fsWrite", static: false, private: false, access: { has: obj => "fsWrite" in obj, get: obj => obj.fsWrite }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _fsCreateFile_decorators, { kind: "method", name: "fsCreateFile", static: false, private: false, access: { has: obj => "fsCreateFile" in obj, get: obj => obj.fsCreateFile }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _fsCreateDir_decorators, { kind: "method", name: "fsCreateDir", static: false, private: false, access: { has: obj => "fsCreateDir" in obj, get: obj => obj.fsCreateDir }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _fsRename_decorators, { kind: "method", name: "fsRename", static: false, private: false, access: { has: obj => "fsRename" in obj, get: obj => obj.fsRename }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _fsDelete_decorators, { kind: "method", name: "fsDelete", static: false, private: false, access: { has: obj => "fsDelete" in obj, get: obj => obj.fsDelete }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _gitStatus_decorators, { kind: "method", name: "gitStatus", static: false, private: false, access: { has: obj => "gitStatus" in obj, get: obj => obj.gitStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _gitCheckout_decorators, { kind: "method", name: "gitCheckout", static: false, private: false, access: { has: obj => "gitCheckout" in obj, get: obj => obj.gitCheckout }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _gitCreateBranch_decorators, { kind: "method", name: "gitCreateBranch", static: false, private: false, access: { has: obj => "gitCreateBranch" in obj, get: obj => obj.gitCreateBranch }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _gitPull_decorators, { kind: "method", name: "gitPull", static: false, private: false, access: { has: obj => "gitPull" in obj, get: obj => obj.gitPull }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _chat_decorators, { kind: "method", name: "chat", static: false, private: false, access: { has: obj => "chat" in obj, get: obj => obj.chat }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _qqList_decorators, { kind: "method", name: "qqList", static: false, private: false, access: { has: obj => "qqList" in obj, get: obj => obj.qqList }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _qqRead_decorators, { kind: "method", name: "qqRead", static: false, private: false, access: { has: obj => "qqRead" in obj, get: obj => obj.qqRead }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _qqSend_decorators, { kind: "method", name: "qqSend", static: false, private: false, access: { has: obj => "qqSend" in obj, get: obj => obj.qqSend }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static inject = [];
        static Config = s.object({});
        constructor(ctx, _config) {
            super(ctx, 'shining');
            __runInitializers(this, _instanceExtraInitializers);
            ctx.inject(['settings'], (settingsCtx) => {
                try {
                    // 0.1.5：`settingsNamespace()` 工厂已移除，register 直接收裸命名空间字符串。
                    settingsCtx.settings.register(SETTINGS_NAMESPACE, ShiningSettingsSchema);
                }
                catch (error) {
                    console.error('[shining:host] settings namespace registration failed', {
                        namespace: SETTINGS_NAMESPACE,
                        error: error instanceof Error ? error.message : String(error),
                    });
                    return;
                }
                const readSettings = () => settingsCtx.settings.get(SETTINGS_NAMESPACE) ?? DEFAULT_SHINING_SETTINGS;
                void (async () => {
                    const settings = readSettings();
                    if (!settings.qq?.enabled || !settings.qq.appId || !settings.qq.appSecret)
                        return;
                    try {
                        const adapter = await createQqAdapter(settings.qq.appId, settings.qq.appSecret);
                        const svc = new ShiningQqService(adapter, createQqModelCall(), readSettings);
                        ctx.provide('shiningQq', svc);
                        ctx.effect(() => () => svc.dispose(), 'shining: qq lifecycle');
                    }
                    catch (error) {
                        console.error('[shining:host] QQ service failed to start', { error: error instanceof Error ? error.message : String(error) });
                    }
                })();
            });
        }
        async fsList(request) {
            try {
                const dir = resolveWithinRoot(request.root, request.path);
                const entries = await fs.readdir(dir, { withFileTypes: true });
                const shown = entries
                    .filter((e) => request.showHidden === true || !e.name.startsWith('.'))
                    .map((e) => ({ name: e.name, isDirectory: e.isDirectory(), size: 0 }));
                for (const entry of shown) {
                    if (!entry.isDirectory) {
                        try {
                            entry.size = (await fs.stat(join(dir, entry.name))).size;
                        }
                        catch { /* size optional */ }
                    }
                }
                return success({ entries: shown.sort((a, b) => Number(b.isDirectory) - Number(a.isDirectory) || a.name.localeCompare(b.name)) });
            }
            catch (error) {
                return failure('shining/fs-error', error instanceof Error ? error.message : String(error));
            }
        }
        async fsRead(request) {
            try {
                const file = resolveWithinRoot(request.root, request.path);
                return success({ content: await fs.readFile(file, 'utf8') });
            }
            catch (error) {
                return failure('shining/fs-error', error instanceof Error ? error.message : String(error));
            }
        }
        async fsWrite(request) {
            try {
                const file = resolveWithinRoot(request.root, request.path);
                await fs.writeFile(file, request.content, 'utf8');
                return success({ path: file });
            }
            catch (error) {
                return failure('shining/fs-error', error instanceof Error ? error.message : String(error));
            }
        }
        async fsCreateFile(request) {
            try {
                const file = resolveWithinRoot(request.root, request.path);
                await fs.writeFile(file, '', { flag: 'wx' });
                return success({ path: file });
            }
            catch (error) {
                return failure('shining/fs-error', error instanceof Error ? error.message : String(error));
            }
        }
        async fsCreateDir(request) {
            try {
                const dir = resolveWithinRoot(request.root, request.path);
                await fs.mkdir(dir, { recursive: false });
                return success({ path: dir });
            }
            catch (error) {
                return failure('shining/fs-error', error instanceof Error ? error.message : String(error));
            }
        }
        async fsRename(request) {
            try {
                const target = resolveWithinRoot(request.root, request.path);
                const next = resolveWithinRoot(request.root, join(dirname(target), request.newName));
                await fs.rename(target, next);
                return success({ path: next });
            }
            catch (error) {
                return failure('shining/fs-error', error instanceof Error ? error.message : String(error));
            }
        }
        async fsDelete(request) {
            try {
                const target = resolveWithinRoot(request.root, request.path);
                await fs.rm(target, { recursive: true, force: false });
                return success({ path: target });
            }
            catch (error) {
                return failure('shining/fs-error', error instanceof Error ? error.message : String(error));
            }
        }
        async gitStatus(request) {
            try {
                const repo = resolveWithinRoot(request.root, request.repoPath);
                const branch = await gitResult(repo, ['branch', '--show-current']);
                const porcelain = await gitResult(repo, ['status', '--porcelain']);
                const lines = porcelain === '' ? [] : porcelain.split('\n');
                const changes = lines.map((line) => {
                    const indexStatus = line[0] !== ' ' ? line[0] : line[1] !== ' ' ? line[1] : 'M';
                    return {
                        path: line.slice(3),
                        status: (indexStatus === '?' ? 'U' : indexStatus),
                    };
                });
                return success({ branch, dirtyCount: lines.length, changes });
            }
            catch (error) {
                return failure('shining/git-error', error instanceof Error ? error.message : String(error));
            }
        }
        async gitCheckout(request) {
            try {
                const repo = resolveWithinRoot(request.root, request.repoPath);
                return success({ output: await gitResult(repo, ['checkout', request.branch]) });
            }
            catch (error) {
                return failure('shining/git-error', error instanceof Error ? error.message : String(error));
            }
        }
        async gitCreateBranch(request) {
            try {
                const repo = resolveWithinRoot(request.root, request.repoPath);
                return success({ output: await gitResult(repo, ['checkout', '-b', request.name]) });
            }
            catch (error) {
                return failure('shining/git-error', error instanceof Error ? error.message : String(error));
            }
        }
        async gitPull(request) {
            try {
                const repo = resolveWithinRoot(request.root, request.repoPath);
                return success({ output: await gitResult(repo, ['pull']) });
            }
            catch (error) {
                return failure('shining/git-error', error instanceof Error ? error.message : String(error));
            }
        }
        async chat(request) {
            try {
                const response = await fetch(`${request.apiBase.replace(/\/$/, '')}/chat/completions`, {
                    method: 'POST',
                    headers: { 'content-type': 'application/json', authorization: `Bearer ${request.apiKey}` },
                    body: JSON.stringify({ model: request.model, messages: request.messages, stream: false }),
                    signal: AbortSignal.timeout(120000),
                });
                if (!response.ok)
                    return failure('shining/chat-error', `upstream ${response.status}`);
                const data = (await response.json());
                return success({ content: data.choices?.[0]?.message?.content ?? '' });
            }
            catch (error) {
                return failure('shining/chat-error', error instanceof Error ? error.message : String(error));
            }
        }
        async qqList(_request) {
            try {
                const svc = this.ctx.shiningQq;
                const sessions = (svc?.list() ?? []).map((s) => ({ key: s.key, peerId: s.peerId, kind: s.kind, messages: s.messages, updatedAt: s.updatedAt }));
                return success({ sessions });
            }
            catch (error) {
                return failure('shining/qq-error', error instanceof Error ? error.message : String(error));
            }
        }
        async qqRead(request) {
            try {
                const svc = this.ctx.shiningQq;
                const s = svc?.read(request.key);
                return success({ session: s ? { key: s.key, peerId: s.peerId, kind: s.kind, messages: s.messages, updatedAt: s.updatedAt } : undefined });
            }
            catch (error) {
                return failure('shining/qq-error', error instanceof Error ? error.message : String(error));
            }
        }
        async qqSend(request) {
            try {
                const svc = this.ctx.shiningQq;
                if (!svc)
                    throw new Error('qq service not enabled');
                await svc.sendTo(request.key, request.content);
                return success({ ok: true });
            }
            catch (error) {
                return failure('shining/qq-error', error instanceof Error ? error.message : String(error));
            }
        }
    };
})();
export { ShiningService };
export default ShiningService;
