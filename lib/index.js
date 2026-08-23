import { settingsNamespace } from "@deepseek-ai/dsh-settings";
import { chmodSync, existsSync, mkdirSync, promises, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import "@deepseek-ai/cordis";
import s from "@deepseek-ai/schemastery";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { homedir } from "node:os";

//#region lib/types/types.js
/** 成功分支。 */
function success(value) {
	return Object.freeze({
		ok: true,
		value
	});
}
/** 失败分支。 */
function failure(code, message, extra = {}) {
	return Object.freeze({
		ok: false,
		error: Object.freeze({
			code,
			message,
			...extra
		})
	});
}
/** 将客户端路径解析为绝对路径，并强制位于 root 之内（防目录穿越）。 */
function resolveWithinRoot(root, path) {
	const rootAbs = resolve(root);
	const target = resolve(rootAbs, path);
	if (target !== rootAbs && !target.startsWith(rootAbs + sep)) throw new Error(`path-root-escape: ${target} is outside ${rootAbs}`);
	return target;
}

//#endregion
//#region lib/types/gateway.js
var __runInitializers = void 0 && (void 0).__runInitializers || function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate = void 0 && (void 0).__esDecorate || function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) if (kind === "field") initializers.unshift(_);
		else descriptor[key] = _;
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
const execFileAsync = promisify(execFile);
/** 在 repo 目录执行 git 命令。 */
async function gitResult(repo, args) {
	const { stdout } = await execFileAsync("git", [
		"-C",
		repo,
		...args
	], { timeout: 3e4 });
	return stdout.trim();
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
	return class ShiningService$1 extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_fsList_decorators = [Remote("fsList")];
			_fsRead_decorators = [Remote("fsRead")];
			_fsWrite_decorators = [Remote("fsWrite")];
			_fsCreateFile_decorators = [Remote("fsCreateFile")];
			_fsCreateDir_decorators = [Remote("fsCreateDir")];
			_fsRename_decorators = [Remote("fsRename")];
			_fsDelete_decorators = [Remote("fsDelete")];
			_gitStatus_decorators = [Remote("gitStatus")];
			_gitCheckout_decorators = [Remote("gitCheckout")];
			_gitCreateBranch_decorators = [Remote("gitCreateBranch")];
			_gitPull_decorators = [Remote("gitPull")];
			_chat_decorators = [Remote("chat")];
			_qqList_decorators = [Remote("qqList")];
			_qqRead_decorators = [Remote("qqRead")];
			_qqSend_decorators = [Remote("qqSend")];
			__esDecorate(this, null, _fsList_decorators, {
				kind: "method",
				name: "fsList",
				static: false,
				private: false,
				access: {
					has: (obj) => "fsList" in obj,
					get: (obj) => obj.fsList
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _fsRead_decorators, {
				kind: "method",
				name: "fsRead",
				static: false,
				private: false,
				access: {
					has: (obj) => "fsRead" in obj,
					get: (obj) => obj.fsRead
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _fsWrite_decorators, {
				kind: "method",
				name: "fsWrite",
				static: false,
				private: false,
				access: {
					has: (obj) => "fsWrite" in obj,
					get: (obj) => obj.fsWrite
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _fsCreateFile_decorators, {
				kind: "method",
				name: "fsCreateFile",
				static: false,
				private: false,
				access: {
					has: (obj) => "fsCreateFile" in obj,
					get: (obj) => obj.fsCreateFile
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _fsCreateDir_decorators, {
				kind: "method",
				name: "fsCreateDir",
				static: false,
				private: false,
				access: {
					has: (obj) => "fsCreateDir" in obj,
					get: (obj) => obj.fsCreateDir
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _fsRename_decorators, {
				kind: "method",
				name: "fsRename",
				static: false,
				private: false,
				access: {
					has: (obj) => "fsRename" in obj,
					get: (obj) => obj.fsRename
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _fsDelete_decorators, {
				kind: "method",
				name: "fsDelete",
				static: false,
				private: false,
				access: {
					has: (obj) => "fsDelete" in obj,
					get: (obj) => obj.fsDelete
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _gitStatus_decorators, {
				kind: "method",
				name: "gitStatus",
				static: false,
				private: false,
				access: {
					has: (obj) => "gitStatus" in obj,
					get: (obj) => obj.gitStatus
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _gitCheckout_decorators, {
				kind: "method",
				name: "gitCheckout",
				static: false,
				private: false,
				access: {
					has: (obj) => "gitCheckout" in obj,
					get: (obj) => obj.gitCheckout
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _gitCreateBranch_decorators, {
				kind: "method",
				name: "gitCreateBranch",
				static: false,
				private: false,
				access: {
					has: (obj) => "gitCreateBranch" in obj,
					get: (obj) => obj.gitCreateBranch
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _gitPull_decorators, {
				kind: "method",
				name: "gitPull",
				static: false,
				private: false,
				access: {
					has: (obj) => "gitPull" in obj,
					get: (obj) => obj.gitPull
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _chat_decorators, {
				kind: "method",
				name: "chat",
				static: false,
				private: false,
				access: {
					has: (obj) => "chat" in obj,
					get: (obj) => obj.chat
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _qqList_decorators, {
				kind: "method",
				name: "qqList",
				static: false,
				private: false,
				access: {
					has: (obj) => "qqList" in obj,
					get: (obj) => obj.qqList
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _qqRead_decorators, {
				kind: "method",
				name: "qqRead",
				static: false,
				private: false,
				access: {
					has: (obj) => "qqRead" in obj,
					get: (obj) => obj.qqRead
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _qqSend_decorators, {
				kind: "method",
				name: "qqSend",
				static: false,
				private: false,
				access: {
					has: (obj) => "qqSend" in obj,
					get: (obj) => obj.qqSend
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		static inject = [];
		static Config = s.object({});
		constructor(ctx, _config) {
			super(ctx, "shining");
			__runInitializers(this, _instanceExtraInitializers);
		}
		async fsList(request) {
			try {
				const dir = resolveWithinRoot(request.root, request.path);
				const entries = await promises.readdir(dir, { withFileTypes: true });
				const shown = entries.filter((e) => request.showHidden === true || !e.name.startsWith(".")).map((e) => ({
					name: e.name,
					isDirectory: e.isDirectory(),
					size: 0
				}));
				for (const entry of shown) if (!entry.isDirectory) try {
					entry.size = (await promises.stat(join(dir, entry.name))).size;
				} catch {}
				return success({ entries: shown.sort((a, b) => Number(b.isDirectory) - Number(a.isDirectory) || a.name.localeCompare(b.name)) });
			} catch (error) {
				return failure("fs-error", error instanceof Error ? error.message : String(error));
			}
		}
		async fsRead(request) {
			try {
				const file = resolveWithinRoot(request.root, request.path);
				return success({ content: await promises.readFile(file, "utf8") });
			} catch (error) {
				return failure("fs-error", error instanceof Error ? error.message : String(error));
			}
		}
		async fsWrite(request) {
			try {
				const file = resolveWithinRoot(request.root, request.path);
				await promises.writeFile(file, request.content, "utf8");
				return success({ path: file });
			} catch (error) {
				return failure("fs-error", error instanceof Error ? error.message : String(error));
			}
		}
		async fsCreateFile(request) {
			try {
				const file = resolveWithinRoot(request.root, request.path);
				await promises.writeFile(file, "", { flag: "wx" });
				return success({ path: file });
			} catch (error) {
				return failure("fs-error", error instanceof Error ? error.message : String(error));
			}
		}
		async fsCreateDir(request) {
			try {
				const dir = resolveWithinRoot(request.root, request.path);
				await promises.mkdir(dir, { recursive: false });
				return success({ path: dir });
			} catch (error) {
				return failure("fs-error", error instanceof Error ? error.message : String(error));
			}
		}
		async fsRename(request) {
			try {
				const target = resolveWithinRoot(request.root, request.path);
				const next = resolveWithinRoot(request.root, join(dirname(target), request.newName));
				await promises.rename(target, next);
				return success({ path: next });
			} catch (error) {
				return failure("fs-error", error instanceof Error ? error.message : String(error));
			}
		}
		async fsDelete(request) {
			try {
				const target = resolveWithinRoot(request.root, request.path);
				await promises.rm(target, {
					recursive: true,
					force: false
				});
				return success({ path: target });
			} catch (error) {
				return failure("fs-error", error instanceof Error ? error.message : String(error));
			}
		}
		async gitStatus(request) {
			try {
				const repo = resolveWithinRoot(request.root, request.repoPath);
				const branch = await gitResult(repo, ["branch", "--show-current"]);
				const porcelain = await gitResult(repo, ["status", "--porcelain"]);
				const lines = porcelain === "" ? [] : porcelain.split("\n");
				const changes = lines.map((line) => ({
					path: line.slice(3),
					status: line[0] === "?" ? "U" : line[0]
				}));
				return success({
					branch,
					dirtyCount: lines.length,
					changes
				});
			} catch (error) {
				return failure("git-error", error instanceof Error ? error.message : String(error));
			}
		}
		async gitCheckout(request) {
			try {
				const repo = resolveWithinRoot(request.root, request.repoPath);
				return success({ output: await gitResult(repo, ["checkout", request.branch]) });
			} catch (error) {
				return failure("git-error", error instanceof Error ? error.message : String(error));
			}
		}
		async gitCreateBranch(request) {
			try {
				const repo = resolveWithinRoot(request.root, request.repoPath);
				return success({ output: await gitResult(repo, [
					"checkout",
					"-b",
					request.name
				]) });
			} catch (error) {
				return failure("git-error", error instanceof Error ? error.message : String(error));
			}
		}
		async gitPull(request) {
			try {
				const repo = resolveWithinRoot(request.root, request.repoPath);
				return success({ output: await gitResult(repo, ["pull"]) });
			} catch (error) {
				return failure("git-error", error instanceof Error ? error.message : String(error));
			}
		}
		async chat(request) {
			try {
				const response = await fetch(`${request.apiBase.replace(/\/$/, "")}/chat/completions`, {
					method: "POST",
					headers: {
						"content-type": "application/json",
						authorization: `Bearer ${request.apiKey}`
					},
					body: JSON.stringify({
						model: request.model,
						messages: request.messages,
						stream: false
					}),
					signal: AbortSignal.timeout(12e4)
				});
				if (!response.ok) return failure("chat-error", `upstream ${response.status}`);
				const data = await response.json();
				return success({ content: data.choices?.[0]?.message?.content ?? "" });
			} catch (error) {
				return failure("chat-error", error instanceof Error ? error.message : String(error));
			}
		}
		async qqList(_request) {
			try {
				const svc = this.ctx.shiningQq;
				const sessions = (svc?.list() ?? []).map((s$1) => ({
					key: s$1.key,
					peerId: s$1.peerId,
					kind: s$1.kind,
					messages: s$1.messages,
					updatedAt: s$1.updatedAt
				}));
				return success({ sessions });
			} catch (error) {
				return failure("qq-error", error instanceof Error ? error.message : String(error));
			}
		}
		async qqRead(request) {
			try {
				const svc = this.ctx.shiningQq;
				const s$1 = svc?.read(request.key);
				return success({ session: s$1 ? {
					key: s$1.key,
					peerId: s$1.peerId,
					kind: s$1.kind,
					messages: s$1.messages,
					updatedAt: s$1.updatedAt
				} : void 0 });
			} catch (error) {
				return failure("qq-error", error instanceof Error ? error.message : String(error));
			}
		}
		async qqSend(request) {
			try {
				const svc = this.ctx.shiningQq;
				if (!svc) return failure("qq-error", "qq service not enabled");
				await svc.sendTo(request.key, request.content);
				return success({ ok: true });
			} catch (error) {
				return failure("qq-error", error instanceof Error ? error.message : String(error));
			}
		}
	};
})();

//#endregion
//#region lib/types/qq.js
let storeRoot = join(homedir(), ".dsh", "shiningweb", "qq-store");
const STORE_ROOT = () => storeRoot;
function storeFile(key) {
	const safe = key.replace(/[\\/:]/g, "_");
	return join(STORE_ROOT(), `${safe}.json`);
}
function ensureDir() {
	mkdirSync(STORE_ROOT(), { recursive: true });
}
/** 读取一个会话。 */
function readQqSession(key) {
	const file = storeFile(key);
	if (!existsSync(file)) return void 0;
	try {
		return JSON.parse(readFileSync(file, "utf8"));
	} catch {
		return void 0;
	}
}
function writeSession(session) {
	ensureDir();
	writeFileSync(storeFile(session.key), JSON.stringify(session, null, 2), "utf8");
	try {
		chmodSync(storeFile(session.key), 384);
	} catch {}
}
/**
* ShiningQqService：bot.on('message') → 会话缓冲 → 独立模型 → bot.sendMarkdown 回复。
* @param adapter - 传输适配器。
* @param callModel - 独立模型调用。
* @param readSettings - 读天圆地方 settings（含 qq/chat/独立模型配置）。
* @param getGroupAllow - 群号白名单（空=允许所有）。
*/
var ShiningQqService = class {
	adapter;
	callModel;
	readSettings;
	sessions = new Map();
	disposed = false;
	disposeMessage;
	constructor(adapter, callModel, readSettings) {
		this.adapter = adapter;
		this.callModel = callModel;
		this.readSettings = readSettings;
		this.disposeMessage = adapter.onMessage((msg) => this.handleMessage(msg));
	}
	/** 处理一条 QQ 消息。 */
	async handleMessage(msg) {
		if (this.disposed) return;
		const settings = this.readSettings();
		if (!settings?.qq?.enabled) return;
		const isGroup = msg.kind === "group";
		if (isGroup && settings.qq.groupAllow.length > 0 && !settings.qq.groupAllow.includes(msg.peerId)) return;
		const key = `${msg.kind}:${msg.peerId}`;
		let session = this.sessions.get(key) ?? readQqSession(key);
		if (!session) session = {
			key,
			peerId: msg.peerId,
			kind: msg.kind,
			messages: [],
			updatedAt: Date.now()
		};
		const persona = settings.qq.personaPrompt;
		const hist = session.messages.slice(-10).map((m) => ({
			role: m.role,
			content: m.content
		}));
		const modelMessages = [
			{
				role: "system",
				content: persona
			},
			...hist,
			{
				role: "user",
				content: msg.content
			}
		];
		let reply = "（回复失败）";
		try {
			const res = await this.callModel(modelMessages, settings);
			reply = res.content || "（空回复）";
		} catch {}
		session.messages.push({
			role: "user",
			content: msg.content
		}, {
			role: "assistant",
			content: reply
		});
		session.updatedAt = Date.now();
		this.sessions.set(key, session);
		writeSession(session);
		await this.adapter.sendMarkdown({
			scope: msg.kind,
			targetId: msg.peerId,
			msgId: msg.messageId
		}, reply);
	}
	/** 列出会话（GUI）。 */
	list() {
		return [...this.sessions.values()].sort((a, b) => b.updatedAt - a.updatedAt);
	}
	/** 读取某会话（GUI）。 */
	read(key) {
		return this.sessions.get(key) ?? readQqSession(key);
	}
	/** GUI 主动发一条消息到某 QQ 会话（追加 assistant 消息 + sendMarkdown）。 */
	async sendTo(key, content) {
		const session = this.sessions.get(key) ?? readQqSession(key);
		if (!session) return;
		session.messages.push({
			role: "assistant",
			content
		});
		session.updatedAt = Date.now();
		this.sessions.set(key, session);
		writeSession(session);
		await this.adapter.sendMarkdown({
			scope: session.kind,
			targetId: session.peerId
		}, content);
	}
	/** 停止。 */
	dispose() {
		this.disposed = true;
		this.disposeMessage();
		this.adapter.stop();
	}
};
/**
* 真实 QQ connector 适配器：lazy-import @tencent-connect/qqbot-nodejs。
* rc2 仅做 text 消息；media/vision 后续。
*/
async function createQqAdapter(appId, appSecret) {
	const { QQBot } = await import("./dist-BTgfjx-o.js");
	const bot = new QQBot({
		appId,
		appSecret,
		transport: "websocket"
	});
	return {
		onMessage: (cb) => {
			bot.on("message", (mCtx) => {
				const ctx = mCtx;
				const m = ctx?.message ?? mCtx;
				const kind = m.kind === "group" ? "group" : "c2c";
				const peerId = kind === "group" ? String(m.groupOpenid ?? m.senderId ?? "") : String(m.senderId ?? "");
				cb({
					kind,
					peerId,
					senderId: String(m.senderId ?? peerId),
					senderName: typeof m.senderName === "string" ? m.senderName : void 0,
					content: typeof m.content === "string" ? m.content : ""
				});
			});
			return () => {};
		},
		sendMarkdown: async (target, content) => {
			await bot.sendMarkdown({
				scope: target.scope,
				targetId: target.targetId,
				msgId: target.msgId
			}, content);
		},
		start: () => {
			bot.start().catch(() => {});
		},
		stop: () => {
			bot.stop();
		}
	};
}
/** 真实独立模型调用（host fetch，用天圆地方独立模型配置）。 */
function createQqModelCall() {
	return async (messages, settings) => {
		const res = await fetch(`${settings.chat.apiBase.replace(/\/$/, "")}/chat/completions`, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				authorization: `Bearer ${settings.chat.apiKey}`
			},
			body: JSON.stringify({
				model: settings.chat.model,
				messages,
				stream: false
			}),
			signal: AbortSignal.timeout(12e4)
		});
		const data = await res.json();
		return { content: data.choices?.[0]?.message?.content ?? "" };
	};
}

//#endregion
//#region lib/types/settings.js
/** Host settings 命名空间。 */
const SETTINGS_NAMESPACE = "shining";
/** 设置 schema：wire 校验与默认值。 */
const ShiningSettingsSchema = s.object({
	enabled: s.boolean().default(true),
	capabilityMode: s.union([
		s.const("pet"),
		s.const("assistant"),
		s.const("super")
	]).default("pet"),
	chat: s.object({
		enabled: s.boolean().default(true),
		personaId: s.string().default(""),
		model: s.string().default("deepseek-chat"),
		apiBase: s.string().default("https://api.deepseek.com"),
		apiKey: s.string().default("")
	}).default({
		enabled: true,
		personaId: "",
		model: "deepseek-chat",
		apiBase: "https://api.deepseek.com",
		apiKey: ""
	}),
	fileExplorer: s.object({
		enabled: s.boolean().default(true),
		showHidden: s.boolean().default(false)
	}).default({
		enabled: true,
		showHidden: false
	}),
	git: s.object({
		enabled: s.boolean().default(true),
		autoRefresh: s.union([
			s.const("off"),
			s.const("10s"),
			s.const("30s"),
			s.const("1m")
		]).default("off")
	}).default({
		enabled: true,
		autoRefresh: "off"
	}),
	visual: s.object({
		themeColor: s.union([
			s.const("galaxy-blue"),
			s.const("dawn-gold"),
			s.const("aurora-purple")
		]).default("galaxy-blue"),
		glassBlur: s.number().min(0).max(24).default(12)
	}).default({
		themeColor: "galaxy-blue",
		glassBlur: 12
	}),
	qq: s.object({
		enabled: s.boolean().default(false),
		appId: s.string().default(""),
		appSecret: s.string().default(""),
		groupAllow: s.array(s.string()).default([]),
		personaPrompt: s.string().default("你是天圆地方，一位温柔而能干的助理。请用简洁、亲切的中文回答。")
	}).default({
		enabled: false,
		appId: "",
		appSecret: "",
		groupAllow: [],
		personaPrompt: "你是天圆地方，一位温柔而能干的助理。请用简洁、亲切的中文回答。"
	})
});

//#endregion
//#region lib/types/index.js
var types_default = ShiningService;
/** Host plugin body：提供网关 + 注册 settings 命名空间 + 可选 QQ 会话层。 */
function apply(ctx) {
	new ShiningService(ctx, {});
	ctx.inject(["settings"], (settingsCtx) => {
		settingsCtx.settings.register(settingsNamespace(SETTINGS_NAMESPACE), ShiningSettingsSchema);
		const readSettings = () => settingsCtx.settings.get(settingsNamespace(SETTINGS_NAMESPACE)) ?? {
			enabled: true,
			capabilityMode: "pet",
			chat: {
				enabled: true,
				personaId: "",
				model: "deepseek-chat",
				apiBase: "https://api.deepseek.com",
				apiKey: ""
			},
			fileExplorer: {
				enabled: true,
				showHidden: false
			},
			git: {
				enabled: true,
				autoRefresh: "off"
			},
			visual: {
				themeColor: "galaxy-blue",
				glassBlur: 12
			},
			qq: {
				enabled: false,
				appId: "",
				appSecret: "",
				groupAllow: [],
				personaPrompt: ""
			}
		};
		(async () => {
			const s$1 = readSettings();
			if (!s$1.qq?.enabled || !s$1.qq.appId || !s$1.qq.appSecret) return;
			try {
				const adapter = await createQqAdapter(s$1.qq.appId, s$1.qq.appSecret);
				const svc = new ShiningQqService(adapter, createQqModelCall(), readSettings);
				ctx.provide("shiningQq", svc);
				ctx.effect(() => () => svc.dispose(), "shining: qq lifecycle");
			} catch {}
		})();
	});
}

//#endregion
export { ShiningService, apply, types_default as default };