import { createRequire } from "module";
import * as fs$2 from "node:fs";
import * as fs$1 from "node:fs";
import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto$2 from "node:crypto";
import * as crypto$1 from "node:crypto";
import * as crypto from "node:crypto";
import * as https$1 from "node:https";
import * as http from "node:http";

//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var __require = /* @__PURE__ */ createRequire(import.meta.url);

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/middleware/types.js
/**
* Run a middleware chain.
*
* Returns `true` if the chain ran to completion (no `stop()`); `false` if
* any middleware short-circuited.
*
* Errors thrown by middleware propagate up — the caller decides whether to
* surface them via `bot.emit("error")` or swallow them.
*/
async function runMiddlewareChain(middlewares, ctx) {
	let index = -1;
	const dispatch = async (i) => {
		if (i <= index) throw new Error("next() called multiple times");
		index = i;
		if (ctx.stopped) return;
		if (i >= middlewares.length) return;
		const fn = middlewares[i];
		if (!fn) return;
		await fn(ctx, () => dispatch(i + 1));
	};
	await dispatch(0);
	return !ctx.stopped;
}
/**
* Build a fresh middleware context for one inbound message.
*
* Internal helper — used by {@link QQBot} when dispatching inbound events.
*/
function createMiddlewareContext(params) {
	const receivedAt = Date.now();
	let stopped = false;
	let stopReason;
	const ac = new AbortController();
	const ctx = {
		bot: params.bot,
		message: params.message,
		replyTarget: params.message.replyTarget,
		state: {},
		log: params.log,
		stop(reason) {
			stopped = true;
			stopReason = reason;
		},
		get stopped() {
			return stopped;
		},
		get stopReason() {
			return stopReason;
		},
		get signal() {
			return ac.signal;
		},
		abort(reason) {
			ac.abort(reason);
			stopped = true;
			stopReason = reason ?? "aborted";
		},
		get aborted() {
			return ac.signal.aborted;
		},
		receivedAt
	};
	return ctx;
}

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/protocol/types.js
/**
* Protocol-level public types for the QQ Open Platform.
*
* 这一层只关心与 QQ 官方 API 协议相关的数据结构（HTTP 请求/响应、
* WebSocket Gateway 事件、消息体、媒体类型等），不包含任何上层框架
* 业务概念（路由、ACP、access policy 等）。
*
* 上层应用通过 `QQBot` facade 与这些类型交互；高级用户也可以从
* `@tencent-connect/qqbot-nodejs/protocol` 直接消费这些低层类型。
*/
/**
* QQ 开放平台 HTTP 调用失败时抛出的结构化错误。
*
* 携带 HTTP 状态码、API 路径以及业务错误码，供上层重试/降级判断使用。
*/
var ApiError = class extends Error {
	httpStatus;
	path;
	bizCode;
	bizMessage;
	name = "ApiError";
	constructor(message, httpStatus, path$1, bizCode, bizMessage) {
		super(message);
		this.httpStatus = httpStatus;
		this.path = path$1;
		this.bizCode = bizCode;
		this.bizMessage = bizMessage;
	}
};
/** QQ Open Platform media file type codes. */
var MediaFileType;
(function(MediaFileType$1) {
	MediaFileType$1[MediaFileType$1["IMAGE"] = 1] = "IMAGE";
	MediaFileType$1[MediaFileType$1["VIDEO"] = 2] = "VIDEO";
	MediaFileType$1[MediaFileType$1["VOICE"] = 3] = "VOICE";
	MediaFileType$1[MediaFileType$1["FILE"] = 4] = "FILE";
})(MediaFileType || (MediaFileType = {}));
const StreamInputMode = { REPLACE: "replace" };
const StreamInputState = {
	GENERATING: 1,
	DONE: 10
};
const StreamContentType = { MARKDOWN: "markdown" };

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/protocol/utils/format.js
/**
* General formatting utilities. Pure helpers with zero external dependencies.
*/
/** Format any error object into a readable string, traversing the `.cause` chain. */
function formatErrorMessage(err) {
	if (err instanceof Error) {
		let formatted = err.message || err.name || "Error";
		let cause = err.cause;
		const seen = new Set([err]);
		while (cause && !seen.has(cause)) {
			seen.add(cause);
			if (cause instanceof Error) {
				if (cause.message) formatted += ` | ${cause.message}`;
				cause = cause.cause;
			} else if (typeof cause === "string") {
				formatted += ` | ${cause}`;
				break;
			} else break;
		}
		return formatted;
	}
	if (typeof err === "string") return err;
	if (err === null || err === void 0 || typeof err === "number" || typeof err === "boolean" || typeof err === "bigint") return String(err);
	try {
		return JSON.stringify(err);
	} catch {
		return Object.prototype.toString.call(err);
	}
}
/** Format a byte count into a human-readable string (e.g. "1.23 MB"). */
function formatFileSize(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
	if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
	return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/protocol/api/api-client.js
const DEFAULT_BASE_URL = "https://api.sgroup.qq.com";
const DEFAULT_TIMEOUT_MS = 3e4;
const FILE_UPLOAD_TIMEOUT_MS = 12e4;
/**
* Stateful HTTP client for the QQ Open Platform.
*/
var ApiClient = class {
	baseUrl;
	defaultTimeoutMs;
	fileUploadTimeoutMs;
	logger;
	resolveUserAgent;
	constructor(config = {}) {
		this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
		this.defaultTimeoutMs = config.defaultTimeoutMs ?? DEFAULT_TIMEOUT_MS;
		this.fileUploadTimeoutMs = config.fileUploadTimeoutMs ?? FILE_UPLOAD_TIMEOUT_MS;
		this.logger = config.logger;
		const ua = config.userAgent ?? "qqbot-nodejs/unknown";
		this.resolveUserAgent = typeof ua === "function" ? ua : () => ua;
	}
	async request(accessToken, method, path$1, body, options) {
		const url = `${this.baseUrl}${path$1}`;
		const headers = {
			Authorization: `QQBot ${accessToken}`,
			"Content-Type": "application/json",
			"User-Agent": this.resolveUserAgent()
		};
		const isFileUpload = options?.uploadRequest === true || path$1.includes("/files") || path$1.includes("/upload_prepare") || path$1.includes("/upload_part_finish");
		const timeout = options?.timeoutMs ?? (isFileUpload ? this.fileUploadTimeoutMs : this.defaultTimeoutMs);
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);
		const fetchInit = {
			method,
			headers,
			signal: controller.signal
		};
		if (body) fetchInit.body = JSON.stringify(body);
		this.logger?.debug?.(`[qqbot:api] >>> ${method} ${url} (timeout: ${timeout}ms)`);
		if (body && this.logger?.debug) {
			const logBody = { ...body };
			for (const key of options?.redactBodyKeys ?? ["file_data"]) if (typeof logBody[key] === "string") logBody[key] = `<redacted ${logBody[key].length} chars>`;
			this.logger.debug(`[qqbot:api] >>> Body: ${JSON.stringify(logBody)}`);
		}
		let res;
		try {
			res = await fetch(url, fetchInit);
		} catch (err) {
			clearTimeout(timeoutId);
			if (err instanceof Error && err.name === "AbortError") {
				this.logger?.error?.(`[qqbot:api] <<< Timeout after ${timeout}ms`);
				throw new ApiError(`Request timeout [${path$1}]: exceeded ${timeout}ms`, 0, path$1);
			}
			this.logger?.error?.(`[qqbot:api] <<< Network error: ${formatErrorMessage(err)}`);
			throw new ApiError(`Network error [${path$1}]: ${formatErrorMessage(err)}`, 0, path$1);
		} finally {
			clearTimeout(timeoutId);
		}
		const traceId = res.headers.get("x-tps-trace-id") ?? "";
		this.logger?.info?.(`[qqbot:api] <<< Status: ${res.status} ${res.statusText}${traceId ? ` | TraceId: ${traceId}` : ""}`);
		let rawBody;
		try {
			rawBody = await res.text();
		} catch (err) {
			throw new ApiError(`Failed to read response [${path$1}]: ${formatErrorMessage(err)}`, res.status, path$1);
		}
		this.logger?.debug?.(`[qqbot:api] <<< Body: ${rawBody}`);
		const contentType = res.headers.get("content-type") ?? "";
		const isHtmlResponse = contentType.includes("text/html") || rawBody.trimStart().startsWith("<");
		if (!res.ok) {
			if (isHtmlResponse) {
				const statusHint = res.status === 502 || res.status === 503 || res.status === 504 ? "调用发生异常，请稍候重试" : res.status === 429 ? "请求过于频繁，已被限流" : `开放平台返回 HTTP ${res.status}`;
				throw new ApiError(`${statusHint}（${path$1}），请稍后重试`, res.status, path$1);
			}
			try {
				const error = JSON.parse(rawBody);
				const bizCode = error.code ?? error.err_code;
				throw new ApiError(`API Error [${path$1}]: ${error.message ?? rawBody}`, res.status, path$1, bizCode, error.message);
			} catch (parseErr) {
				if (parseErr instanceof ApiError) throw parseErr;
				throw new ApiError(`API Error [${path$1}] HTTP ${res.status}: ${rawBody.slice(0, 200)}`, res.status, path$1);
			}
		}
		if (isHtmlResponse) throw new ApiError(`QQ 服务端返回了非 JSON 响应（${path$1}），可能是临时故障，请稍后重试`, res.status, path$1);
		try {
			return JSON.parse(rawBody);
		} catch {
			throw new ApiError(`开放平台响应格式异常（${path$1}），请稍后重试`, res.status, path$1);
		}
	}
};

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/protocol/api/retry.js
async function withRetry(fn, policy, persistentPolicy, logger) {
	let lastError = null;
	for (let attempt = 0; attempt <= policy.maxRetries; attempt++) try {
		return await fn();
	} catch (err) {
		lastError = err instanceof Error ? err : new Error(formatErrorMessage(err));
		if (persistentPolicy?.shouldPersistRetry(lastError)) {
			(logger?.warn ?? logger?.error)?.(`[qqbot:retry] Hit persistent-retry trigger, entering persistent loop (timeout=${persistentPolicy.timeoutMs / 1e3}s)`);
			return await persistentRetryLoop(fn, persistentPolicy, logger);
		}
		if (policy.shouldRetry?.(lastError, attempt) === false) throw lastError;
		if (attempt < policy.maxRetries) {
			const delay = policy.backoff === "exponential" ? policy.baseDelayMs * 2 ** attempt : policy.baseDelayMs;
			logger?.debug?.(`[qqbot:retry] Attempt ${attempt + 1} failed, retrying in ${delay}ms: ${lastError.message.slice(0, 100)}`);
			await sleep$1(delay);
		}
	}
	throw lastError;
}
async function persistentRetryLoop(fn, policy, logger) {
	const deadline = Date.now() + policy.timeoutMs;
	let attempt = 0;
	let lastError = null;
	while (Date.now() < deadline) try {
		const result = await fn();
		logger?.debug?.(`[qqbot:retry] Persistent retry succeeded after ${attempt} retries`);
		return result;
	} catch (err) {
		lastError = err instanceof Error ? err : new Error(formatErrorMessage(err));
		if (!policy.shouldPersistRetry(lastError)) {
			logger?.error?.(`[qqbot:retry] Persistent retry: error is no longer retryable, aborting`);
			throw lastError;
		}
		attempt++;
		const remaining = deadline - Date.now();
		if (remaining <= 0) break;
		const actualDelay = Math.min(policy.intervalMs, remaining);
		(logger?.warn ?? logger?.error)?.(`[qqbot:retry] Persistent retry #${attempt}: retrying in ${actualDelay}ms (remaining=${Math.round(remaining / 1e3)}s)`);
		await sleep$1(actualDelay);
	}
	logger?.error?.(`[qqbot:retry] Persistent retry timed out after ${policy.timeoutMs / 1e3}s (${attempt} attempts)`);
	throw lastError ?? new Error(`Persistent retry timed out (${policy.timeoutMs / 1e3}s)`);
}
function sleep$1(ms) {
	return new Promise((resolve$1) => setTimeout(resolve$1, ms));
}
const UPLOAD_RETRY_POLICY = {
	maxRetries: 2,
	baseDelayMs: 1e3,
	backoff: "exponential",
	shouldRetry: (error) => {
		const msg = error.message;
		return !(msg.includes("400") || msg.includes("401") || msg.includes("Invalid") || msg.includes("timeout") || msg.includes("Timeout"));
	}
};
const COMPLETE_UPLOAD_RETRY_POLICY = {
	maxRetries: 2,
	baseDelayMs: 2e3,
	backoff: "exponential"
};
const PART_FINISH_RETRY_POLICY = {
	maxRetries: 2,
	baseDelayMs: 1e3,
	backoff: "exponential"
};
function buildPartFinishPersistentPolicy(retryTimeoutMs, retryableCodes = PART_FINISH_RETRYABLE_CODES) {
	return {
		timeoutMs: retryTimeoutMs ?? 2 * 60 * 1e3,
		intervalMs: 1e3,
		shouldPersistRetry: (error) => {
			if (retryableCodes.size === 0) return false;
			if ("bizCode" in error && typeof error.bizCode === "number") return retryableCodes.has(error.bizCode);
			return false;
		}
	};
}
const PART_FINISH_RETRYABLE_CODES = new Set([40093001]);
const UPLOAD_PREPARE_FALLBACK_CODE = 40093002;

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/protocol/api/routes.js
/**
* Centralized API route templates for the QQ Open Platform.
*
* Eliminates C2C/Group path duplication by parameterizing on `ChatScope`.
*/
function messagePath(scope, targetId) {
	return scope === "c2c" ? `/v2/users/${targetId}/messages` : `/v2/groups/${targetId}/messages`;
}
function channelMessagePath(channelId) {
	return `/channels/${channelId}/messages`;
}
function dmMessagePath(guildId) {
	return `/dms/${guildId}/messages`;
}
function mediaUploadPath(scope, targetId) {
	return scope === "c2c" ? `/v2/users/${targetId}/files` : `/v2/groups/${targetId}/files`;
}
function uploadPreparePath(scope, targetId) {
	return scope === "c2c" ? `/v2/users/${targetId}/upload_prepare` : `/v2/groups/${targetId}/upload_prepare`;
}
function uploadPartFinishPath(scope, targetId) {
	return scope === "c2c" ? `/v2/users/${targetId}/upload_part_finish` : `/v2/groups/${targetId}/upload_part_finish`;
}
function uploadCompletePath(scope, targetId) {
	return mediaUploadPath(scope, targetId);
}
function streamMessagePath(openid) {
	return `/v2/users/${openid}/stream_messages`;
}
function gatewayPath() {
	return "/gateway";
}
function interactionPath(interactionId) {
	return `/interactions/${interactionId}`;
}
/**
* Generate a message sequence number in the 0..65535 range.
*
* Used by both `messages.ts` and `media.ts` to avoid duplicate definitions.
*/
function getNextMsgSeq(_msgId) {
	const timePart = Date.now() % 1e8;
	const random = Math.floor(Math.random() * 65536);
	return (timePart ^ random) % 65536;
}

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/protocol/api/media-chunked.js
/**
* Raised when `upload_prepare` returns {@link UPLOAD_PREPARE_FALLBACK_CODE}.
*/
var UploadDailyLimitExceededError = class extends Error {
	filePath;
	fileSize;
	name = "UploadDailyLimitExceededError";
	constructor(filePath, fileSize, originalMessage) {
		super(originalMessage);
		this.filePath = filePath;
		this.fileSize = fileSize;
	}
};
const DEFAULT_CONCURRENT_PARTS = 1;
const MAX_CONCURRENT_PARTS = 10;
const MAX_PART_FINISH_RETRY_TIMEOUT_MS = 10 * 60 * 1e3;
const PART_UPLOAD_TIMEOUT_MS = 3e5;
const MD5_10M_SIZE = 10002432;
var ChunkedMediaApi = class {
	client;
	tokenManager;
	logger;
	cache;
	sanitize;
	constructor(client, tokenManager, config = {}) {
		this.client = client;
		this.tokenManager = tokenManager;
		this.logger = config.logger;
		this.cache = config.uploadCache;
		this.sanitize = config.sanitizeFileName ?? ((n) => n);
	}
	async uploadChunked(opts) {
		const prefix = opts.logPrefix ?? "[qqbot:chunked-upload]";
		const input = resolveSource(opts.source, opts.fileName);
		const displayName = input.fileName;
		const fileSize = input.size;
		const pathLabel = input.kind === "localPath" ? input.path : "<buffer>";
		this.logger?.info?.(`${prefix} Start: file=${displayName} size=${formatFileSize(fileSize)} type=${opts.fileType}`);
		const hashes = await computeHashes(input);
		this.logger?.debug?.(`${prefix} hashes: md5=${hashes.md5} sha1=${hashes.sha1} md5_10m=${hashes.md5_10m}`);
		if (this.cache) {
			const cached = this.cache.get(hashes.md5, opts.scope, opts.targetId, opts.fileType);
			if (cached) {
				this.logger?.info?.(`${prefix} cache HIT (md5=${hashes.md5.slice(0, 8)}) — skipping chunked upload`);
				return {
					file_uuid: "",
					file_info: cached,
					ttl: 0
				};
			}
		}
		const fileNameForPrepare = opts.fileType === MediaFileType.FILE ? this.sanitize(displayName) : displayName;
		const prepareResp = await this.callUploadPrepare(opts, fileNameForPrepare, fileSize, hashes, pathLabel);
		const { upload_id, parts } = prepareResp;
		const block_size = prepareResp.block_size;
		const maxConcurrent = Math.min(prepareResp.concurrency ? prepareResp.concurrency : DEFAULT_CONCURRENT_PARTS, MAX_CONCURRENT_PARTS);
		const retryTimeoutMs = prepareResp.retry_timeout ? Math.min(prepareResp.retry_timeout * 1e3, MAX_PART_FINISH_RETRY_TIMEOUT_MS) : void 0;
		this.logger?.info?.(`${prefix} prepared: upload_id=${upload_id} block=${formatFileSize(block_size)} parts=${parts.length} concurrency=${maxConcurrent}`);
		let completedParts = 0;
		let uploadedBytes = 0;
		const uploadPart = async (part) => {
			const partIndex = part.index;
			const offset = (partIndex - 1) * block_size;
			const length = Math.min(block_size, fileSize - offset);
			const partBuffer = await readPart(input, offset, length);
			const md5Hex = crypto$2.createHash("md5").update(partBuffer).digest("hex");
			this.logger?.debug?.(`${prefix} part ${partIndex}/${parts.length}: ${formatFileSize(length)} offset=${offset} md5=${md5Hex}`);
			await putToPresignedUrl(part.presigned_url, partBuffer, partIndex, parts.length, this.logger, prefix);
			await this.callUploadPartFinish(opts, upload_id, partIndex, length, md5Hex, retryTimeoutMs);
			completedParts++;
			uploadedBytes += length;
			this.logger?.info?.(`${prefix} part ${partIndex}/${parts.length} done (${completedParts}/${parts.length})`);
			opts.onProgress?.({
				completedParts,
				totalParts: parts.length,
				uploadedBytes,
				totalBytes: fileSize
			});
		};
		await runWithConcurrency(parts.map((part) => () => uploadPart(part)), maxConcurrent);
		this.logger?.info?.(`${prefix} all parts uploaded, completing...`);
		const result = await this.callCompleteUpload(opts, upload_id);
		this.logger?.info?.(`${prefix} completed: file_uuid=${result.file_uuid} ttl=${result.ttl}s`);
		if (this.cache && result.file_info && result.ttl > 0) this.cache.set(hashes.md5, opts.scope, opts.targetId, opts.fileType, result.file_info, result.file_uuid, result.ttl);
		return result;
	}
	async callUploadPrepare(opts, fileName, fileSize, hashes, pathLabel) {
		const token = await this.tokenManager.getAccessToken(opts.creds.appId, opts.creds.clientSecret);
		const path$1 = uploadPreparePath(opts.scope, opts.targetId);
		try {
			return await this.client.request(token, "POST", path$1, {
				file_type: opts.fileType,
				file_name: fileName,
				file_size: fileSize,
				md5: hashes.md5,
				sha1: hashes.sha1,
				md5_10m: hashes.md5_10m
			}, { uploadRequest: true });
		} catch (err) {
			if (err instanceof ApiError && err.bizCode === UPLOAD_PREPARE_FALLBACK_CODE) throw new UploadDailyLimitExceededError(pathLabel, fileSize, err.message);
			throw err;
		}
	}
	async callUploadPartFinish(opts, uploadId, partIndex, blockSize, md5, retryTimeoutMs) {
		const persistentPolicy = buildPartFinishPersistentPolicy(retryTimeoutMs);
		const path$1 = uploadPartFinishPath(opts.scope, opts.targetId);
		await withRetry(async () => {
			const token = await this.tokenManager.getAccessToken(opts.creds.appId, opts.creds.clientSecret);
			return this.client.request(token, "POST", path$1, {
				upload_id: uploadId,
				part_index: partIndex,
				block_size: blockSize,
				md5
			}, { uploadRequest: true });
		}, PART_FINISH_RETRY_POLICY, persistentPolicy, this.logger);
	}
	async callCompleteUpload(opts, uploadId) {
		const path$1 = uploadCompletePath(opts.scope, opts.targetId);
		return withRetry(async () => {
			const token = await this.tokenManager.getAccessToken(opts.creds.appId, opts.creds.clientSecret);
			return this.client.request(token, "POST", path$1, { upload_id: uploadId }, { uploadRequest: true });
		}, COMPLETE_UPLOAD_RETRY_POLICY, void 0, this.logger);
	}
};
function resolveSource(source, fileNameOverride) {
	if (source.kind === "localPath") {
		const inferredName = source.path.split(/[/\\]/).pop() || "file";
		return {
			kind: "localPath",
			path: source.path,
			size: source.size,
			fileName: fileNameOverride ?? inferredName
		};
	}
	return {
		kind: "buffer",
		buffer: source.buffer,
		size: source.buffer.length,
		fileName: fileNameOverride ?? source.fileName ?? "file"
	};
}
async function readPart(input, offset, length) {
	if (input.kind === "buffer") return input.buffer.subarray(offset, offset + length);
	const handle = await fs$2.promises.open(input.path, "r");
	try {
		const buf = Buffer.alloc(length);
		const { bytesRead } = await handle.read(buf, 0, length, offset);
		return bytesRead < length ? buf.subarray(0, bytesRead) : buf;
	} finally {
		await handle.close();
	}
}
async function computeHashes(input) {
	if (input.kind === "buffer") {
		const md5 = crypto$2.createHash("md5").update(input.buffer).digest("hex");
		const sha1 = crypto$2.createHash("sha1").update(input.buffer).digest("hex");
		const md5_10m = input.size > MD5_10M_SIZE ? crypto$2.createHash("md5").update(input.buffer.subarray(0, MD5_10M_SIZE)).digest("hex") : md5;
		return {
			md5,
			sha1,
			md5_10m
		};
	}
	return new Promise((resolve$1, reject) => {
		const md5 = crypto$2.createHash("md5");
		const sha1 = crypto$2.createHash("sha1");
		const md5_10m = crypto$2.createHash("md5");
		let consumed = 0;
		const needsMd5_10m = input.size > MD5_10M_SIZE;
		const stream = fs$2.createReadStream(input.path);
		stream.on("data", (chunk) => {
			const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			md5.update(buf);
			sha1.update(buf);
			if (needsMd5_10m) {
				const remaining = MD5_10M_SIZE - consumed;
				if (remaining > 0) md5_10m.update(remaining >= buf.length ? buf : buf.subarray(0, remaining));
			}
			consumed += buf.length;
		});
		stream.on("end", () => {
			const md5Hex = md5.digest("hex");
			const sha1Hex = sha1.digest("hex");
			resolve$1({
				md5: md5Hex,
				sha1: sha1Hex,
				md5_10m: needsMd5_10m ? md5_10m.digest("hex") : md5Hex
			});
		});
		stream.on("error", reject);
	});
}
const PART_UPLOAD_MAX_RETRIES = 2;
/**
* PUT data to COS via raw https.request, bypassing fetch/undici.
* Used because Node.js fetch can fail unpredictably in long-running processes.
*/
function putToCOS(presignedUrl, data, signal) {
	return new Promise((resolve$1, reject) => {
		const parsed = new URL(presignedUrl);
		const req = https$1.request(parsed, {
			method: "PUT",
			headers: { "Content-Length": String(data.length) },
			signal
		}, (res) => {
			const chunks = [];
			res.on("data", (c) => chunks.push(c));
			res.on("end", () => {
				const etag = (res.headers.etag ?? "").replace(/"/g, "");
				const requestId = res.headers["x-cos-request-id"]?.toString() ?? "-";
				if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) resolve$1({
					status: res.statusCode,
					etag,
					requestId
				});
				else reject(new Error(`COS PUT failed: ${res.statusCode} ${res.statusMessage ?? ""} - ${Buffer.concat(chunks).toString().slice(0, 120)}`));
			});
			res.on("error", reject);
		});
		req.on("error", (err) => {
			reject(err);
		});
		req.end(data);
	});
}
async function putToPresignedUrl(presignedUrl, data, partIndex, totalParts, logger, prefix) {
	let lastError = null;
	for (let attempt = 0; attempt <= PART_UPLOAD_MAX_RETRIES; attempt++) {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), PART_UPLOAD_TIMEOUT_MS);
		try {
			const startTime = Date.now();
			const { etag, requestId } = await putToCOS(presignedUrl, data, controller.signal);
			const elapsed = Date.now() - startTime;
			logger?.debug?.(`${prefix} PUT part ${partIndex}/${totalParts} OK (${elapsed}ms ETag=${etag} requestId=${requestId})`);
			return;
		} catch (err) {
			lastError = err instanceof Error ? err : new Error(String(err));
			const code = err.code ?? "none";
			const causeMsg = (() => {
				const c = err instanceof Error ? err.cause : void 0;
				return c instanceof Error ? c.message : "none";
			})();
			if (lastError.name === "AbortError") lastError = new Error(`Part ${partIndex}/${totalParts} upload timeout after ${PART_UPLOAD_TIMEOUT_MS}ms`);
			if (attempt < PART_UPLOAD_MAX_RETRIES) {
				const delay = 1e3 * 2 ** attempt;
				(logger?.warn ?? logger?.error)?.(`${prefix} PUT part ${partIndex}/${totalParts} attempt ${attempt + 1} failed (${lastError.message.slice(0, 120)} code=${code} cause=${causeMsg}), retrying in ${delay}ms`);
				await sleep(delay);
			} else (logger?.error)?.(`${prefix} PUT part ${partIndex}/${totalParts} all retries exhausted (code=${code} cause=${causeMsg})`);
		} finally {
			clearTimeout(timeoutId);
		}
	}
	throw lastError ?? new Error(`Part ${partIndex}/${totalParts} upload failed`);
}
async function runWithConcurrency(tasks, maxConcurrent) {
	for (let i = 0; i < tasks.length; i += maxConcurrent) {
		const batch = tasks.slice(i, i + maxConcurrent);
		await Promise.all(batch.map((task) => task()));
	}
}
function sleep(ms) {
	return new Promise((resolve$1) => setTimeout(resolve$1, ms));
}

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/protocol/utils/file-utils.js
/** Maximum file size accepted by the QQ Bot one-shot upload API (base64 direct). */
const MAX_UPLOAD_SIZE = 20 * 1024 * 1024;
/** Absolute upper bound enforced on the chunked upload path. */
const CHUNKED_UPLOAD_MAX_SIZE = 100 * 1024 * 1024;
/** Threshold above which uploads are dispatched to the chunked path. */
const LARGE_FILE_THRESHOLD = 5 * 1024 * 1024;
/** Per-{@link MediaFileType} upload metadata. */
const MEDIA_FILE_TYPE_INFO = {
	[MediaFileType.IMAGE]: {
		maxSize: 30 * 1024 * 1024,
		name: "image"
	},
	[MediaFileType.VIDEO]: {
		maxSize: 100 * 1024 * 1024,
		name: "video"
	},
	[MediaFileType.VOICE]: {
		maxSize: 20 * 1024 * 1024,
		name: "voice"
	},
	[MediaFileType.FILE]: {
		maxSize: 100 * 1024 * 1024,
		name: "file"
	}
};
/**
* Sanitize a filename for safe transmission to the QQ Open Platform.
*
* - Strips path separators / control characters.
* - Collapses repeated whitespace.
* - Falls back to `"file"` when the result is empty.
*/
function sanitizeFileName(name) {
	if (!name) return "file";
	const cleaned = name.replace(/[\\/:*?"<>|]/g, "_").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
	return cleaned || "file";
}

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/protocol/api/media.js
/** base64 编码后的大小上限检查（4/3 × 原始大小 + padding，取 1.4 倍系数） */
const MAX_BASE64_CHECK_SIZE = Math.ceil(MAX_UPLOAD_SIZE * 1.4);
function formatUploadSize() {
	return formatFileSize(MAX_UPLOAD_SIZE);
}
/** Small-file media upload module. */
var MediaApi = class {
	client;
	tokenManager;
	logger;
	cache;
	sanitize;
	constructor(client, tokenManager, config = {}) {
		this.client = client;
		this.tokenManager = tokenManager;
		this.logger = config.logger;
		this.cache = config.uploadCache;
		this.sanitize = config.sanitizeFileName ?? ((n) => n);
	}
	/**
	* Upload media via base64, URL, buffer, or local file path to a C2C or Group target.
	*/
	async uploadMedia(scope, targetId, fileType, creds, opts) {
		const sources = [
			opts.url,
			opts.fileData,
			opts.buffer,
			opts.localPath
		].filter((v) => v !== void 0);
		if (sources.length === 0) throw new Error(`uploadMedia: one of url/fileData/buffer/localPath is required`);
		if (sources.length > 1) throw new Error(`uploadMedia: url/fileData/buffer/localPath are mutually exclusive (got ${sources.length})`);
		let fileData = opts.fileData;
		if (opts.buffer) fileData = opts.buffer.toString("base64");
		else if (opts.localPath) {
			const buf = await fs$1.promises.readFile(opts.localPath);
			fileData = buf.toString("base64");
		}
		if (fileData && fileData.length > MAX_BASE64_CHECK_SIZE) {
			const sizeMB = (fileData.length / (1024 * 1024)).toFixed(1);
			throw new Error(`fileData too large (${sizeMB}MB decoded); QQ Bot single upload limit is ${formatUploadSize()}`);
		}
		if (fileData && this.cache) {
			const hash = this.cache.computeHash(fileData);
			const cached = this.cache.get(hash, scope, targetId, fileType);
			if (cached) return {
				file_uuid: "",
				file_info: cached,
				ttl: 0
			};
		}
		const body = {
			file_type: fileType,
			srv_send_msg: opts.srvSendMsg ?? false
		};
		if (opts.url) body.url = opts.url;
		else if (fileData) body.file_data = fileData;
		if (fileType === MediaFileType.FILE && opts.fileName) body.file_name = this.sanitize(opts.fileName);
		const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
		const path$1 = mediaUploadPath(scope, targetId);
		const result = await withRetry(() => this.client.request(token, "POST", path$1, body, {
			redactBodyKeys: ["file_data"],
			uploadRequest: true
		}), UPLOAD_RETRY_POLICY, void 0, this.logger);
		if (fileData && result.file_info && result.ttl > 0 && this.cache) {
			const hash = this.cache.computeHash(fileData);
			this.cache.set(hash, scope, targetId, fileType, result.file_info, result.file_uuid, result.ttl);
		}
		return result;
	}
	/**
	* Send a media message (post upload) to a C2C or Group target.
	*/
	async sendMediaMessage(scope, targetId, fileInfo, creds, opts) {
		const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
		const msgSeq = opts?.msgId ? getNextMsgSeq(opts.msgId) : 1;
		const path$1 = messagePath(scope, targetId);
		return this.client.request(token, "POST", path$1, {
			msg_type: 7,
			media: { file_info: fileInfo },
			msg_seq: msgSeq,
			...opts?.content ? { content: opts.content } : {},
			...opts?.msgId ? { msg_id: opts.msgId } : {}
		});
	}
};

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/protocol/api/messages.js
var MessageApi = class {
	client;
	tokenManager;
	markdownSupport;
	logger;
	messageSentHook = null;
	constructor(client, tokenManager, config) {
		this.client = client;
		this.tokenManager = tokenManager;
		this.markdownSupport = config.markdownSupport;
		this.logger = config.logger;
	}
	onMessageSent(callback) {
		this.messageSentHook = callback;
	}
	notifyMessageSent(refIdx, meta) {
		if (this.messageSentHook) try {
			this.messageSentHook(refIdx, meta);
		} catch (err) {
			this.logger?.error?.(`[qqbot:messages] onMessageSent hook error: ${formatErrorMessage(err)}`);
		}
	}
	async sendMessage(scope, targetId, content, creds, opts) {
		const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
		const msgSeq = opts?.msgId ? getNextMsgSeq(opts.msgId) : 1;
		const body = this.buildMessageBody(content, opts?.msgId, msgSeq, opts?.messageReference, opts?.inlineKeyboard);
		const path$1 = messagePath(scope, targetId);
		return this.sendAndNotify(creds.appId, token, "POST", path$1, body, { text: content });
	}
	async sendProactiveMessage(scope, targetId, content, creds) {
		if (!content?.trim()) throw new Error("Proactive message content must not be empty");
		const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
		const body = this.buildProactiveBody(content);
		const path$1 = messagePath(scope, targetId);
		return this.sendAndNotify(creds.appId, token, "POST", path$1, body, { text: content });
	}
	async sendChannelMessage(opts) {
		const token = await this.tokenManager.getAccessToken(opts.creds.appId, opts.creds.clientSecret);
		return this.client.request(token, "POST", channelMessagePath(opts.channelId), {
			content: opts.content,
			...opts.msgId ? { msg_id: opts.msgId } : {}
		});
	}
	async sendDmMessage(opts) {
		const token = await this.tokenManager.getAccessToken(opts.creds.appId, opts.creds.clientSecret);
		return this.client.request(token, "POST", dmMessagePath(opts.guildId), {
			content: opts.content,
			...opts.msgId ? { msg_id: opts.msgId } : {}
		});
	}
	/** Send a typing indicator to a C2C user. */
	async sendInputNotify(opts) {
		const inputSecond = opts.inputSecond ?? 60;
		const token = await this.tokenManager.getAccessToken(opts.creds.appId, opts.creds.clientSecret);
		const msgSeq = opts.msgId ? getNextMsgSeq(opts.msgId) : 1;
		const response = await this.client.request(token, "POST", messagePath("c2c", opts.openid), {
			msg_type: 6,
			input_notify: {
				input_type: 1,
				input_second: inputSecond
			},
			msg_seq: msgSeq,
			...opts.msgId ? { msg_id: opts.msgId } : {}
		});
		return { refIdx: response.ext_info?.ref_idx };
	}
	async acknowledgeInteraction(interactionId, creds, code = 0, data) {
		const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
		const body = { code };
		if (data) body.data = data;
		await this.client.request(token, "PUT", interactionPath(interactionId), body);
	}
	/** Get the WebSocket gateway URL for the bot. */
	async getGatewayUrl(creds) {
		const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
		const data = await this.client.request(token, "GET", gatewayPath());
		return data.url;
	}
	/**
	* Send a C2C stream message chunk (`/v2/users/{openid}/stream_messages`).
	* Only supported for one-to-one chats.
	*/
	async sendC2CStreamMessage(creds, openid, req) {
		const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
		const path$1 = streamMessagePath(openid);
		const body = {
			input_mode: req.input_mode,
			input_state: req.input_state,
			content_type: req.content_type,
			content_raw: req.content_raw,
			event_id: req.event_id,
			msg_id: req.msg_id,
			msg_seq: req.msg_seq,
			index: req.index
		};
		if (req.stream_msg_id) body.stream_msg_id = req.stream_msg_id;
		return this.client.request(token, "POST", path$1, body);
	}
	/**
	* Raw message send — transparently forwards all fields to the QQ Open Platform API.
	*
	* This is the "escape hatch" for any message type not covered by the
	* higher-level helpers. Fields like `msg_type`, `markdown`, `ark`, `embed`,
	* `keyboard`, `media`, `message_reference`, `is_wakeup` etc. are passed through
	* as-is to `/v2/users/{openid}/messages` or `/v2/groups/{group_openid}/messages`.
	*
	* Auto-injects `msg_seq` if not provided.
	*/
	async sendRaw(scope, targetId, creds, body) {
		const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
		const path$1 = messagePath(scope, targetId);
		if (body.msg_seq === void 0) body.msg_seq = body.msg_id ? getNextMsgSeq(body.msg_id) : 1;
		if (body.msg_type === void 0) if (body.markdown) body.msg_type = 2;
		else if (body.ark) body.msg_type = 3;
		else if (body.embed) body.msg_type = 4;
		else if (body.media) body.msg_type = 7;
		else body.msg_type = 0;
		const cleaned = Object.fromEntries(Object.entries(body).filter(([, v]) => v !== void 0));
		return this.sendAndNotify(creds.appId, token, "POST", path$1, cleaned, { text: cleaned.content ?? cleaned.markdown?.content });
	}
	/**
	* Send a message to a guild text channel.
	* Supports content, keyboard, message_reference, and arbitrary extra fields.
	*/
	async sendChannelMessageRaw(channelId, creds, body) {
		const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
		const cleaned = Object.fromEntries(Object.entries(body).filter(([, v]) => v !== void 0));
		return this.client.request(token, "POST", channelMessagePath(channelId), cleaned);
	}
	/**
	* Send a DM (direct message) in a guild.
	*/
	async sendDmMessageRaw(guildId, creds, body) {
		const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
		const cleaned = Object.fromEntries(Object.entries(body).filter(([, v]) => v !== void 0));
		return this.client.request(token, "POST", dmMessagePath(guildId), cleaned);
	}
	/**
	* Recall (delete) a message.
	*/
	async recallMessage(scope, targetId, messageId, creds) {
		const token = await this.tokenManager.getAccessToken(creds.appId, creds.clientSecret);
		const path$1 = `${messagePath(scope, targetId)}/${messageId}`;
		await this.client.request(token, "DELETE", path$1);
	}
	async sendAndNotify(_appId, accessToken, method, path$1, body, meta) {
		const result = await this.client.request(accessToken, method, path$1, body);
		if (result.ext_info?.ref_idx && this.messageSentHook) try {
			this.messageSentHook(result.ext_info.ref_idx, meta);
		} catch (err) {
			this.logger?.error?.(`[qqbot:messages] onMessageSent hook error: ${formatErrorMessage(err)}`);
		}
		return result;
	}
	buildMessageBody(content, msgId, msgSeq, messageReference, inlineKeyboard) {
		const body = this.markdownSupport ? {
			markdown: { content },
			msg_type: 2,
			msg_seq: msgSeq
		} : {
			content,
			msg_type: 0,
			msg_seq: msgSeq
		};
		if (msgId) body.msg_id = msgId;
		if (messageReference && !this.markdownSupport) body.message_reference = { message_id: messageReference };
		if (inlineKeyboard) body.keyboard = inlineKeyboard;
		return body;
	}
	buildProactiveBody(content) {
		return this.markdownSupport ? {
			markdown: { content },
			msg_type: 2
		} : {
			content,
			msg_type: 0
		};
	}
};

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/protocol/api/token.js
const DEFAULT_TOKEN_BASE_URL = "https://bots.qq.com";
const TOKEN_PATH = "/app/getAppAccessToken";
const DEFAULT_TOKEN_TIMEOUT_MS = 1e4;
const FIVE_MINUTES_MS = 5 * 60 * 1e3;
var TokenManager = class {
	cache = new Map();
	fetchPromises = new Map();
	refreshControllers = new Map();
	logger;
	resolveUserAgent;
	baseUrl;
	constructor(config) {
		this.logger = config?.logger;
		const ua = config?.userAgent ?? "qqbot-nodejs/unknown";
		this.resolveUserAgent = typeof ua === "function" ? ua : () => ua;
		this.baseUrl = config?.baseUrl ?? DEFAULT_TOKEN_BASE_URL;
	}
	async getAccessToken(appId, clientSecret) {
		const normalizedId = appId.trim();
		const cached = this.cache.get(normalizedId);
		const refreshAheadMs = cached ? Math.min(FIVE_MINUTES_MS, (cached.expiresAt - Date.now()) / 3) : 0;
		if (cached && Date.now() < cached.expiresAt - refreshAheadMs) return cached.token;
		let pending = this.fetchPromises.get(normalizedId);
		if (pending) {
			this.logger?.debug?.(`[qqbot:token:${normalizedId}] Fetch in progress, reusing promise`);
			return pending;
		}
		pending = (async () => {
			try {
				return await this.doFetchToken(normalizedId, clientSecret);
			} finally {
				this.fetchPromises.delete(normalizedId);
			}
		})();
		this.fetchPromises.set(normalizedId, pending);
		return pending;
	}
	clearCache(appId) {
		if (appId) {
			this.cache.delete(appId.trim());
			this.logger?.debug?.(`[qqbot:token:${appId}] Cache cleared`);
		} else {
			this.cache.clear();
			this.logger?.debug?.(`[token] All caches cleared`);
		}
	}
	getStatus(appId) {
		if (this.fetchPromises.has(appId)) return {
			status: "refreshing",
			expiresAt: this.cache.get(appId)?.expiresAt ?? null
		};
		const cached = this.cache.get(appId);
		if (!cached) return {
			status: "none",
			expiresAt: null
		};
		const remaining = cached.expiresAt - Date.now();
		const isValid = remaining > Math.min(FIVE_MINUTES_MS, remaining / 3);
		return {
			status: isValid ? "valid" : "expired",
			expiresAt: cached.expiresAt
		};
	}
	startBackgroundRefresh(appId, clientSecret, options) {
		if (this.refreshControllers.has(appId)) {
			this.logger?.info?.(`[qqbot:token:${appId}] Background refresh already running`);
			return;
		}
		const { refreshAheadMs = 5 * 60 * 1e3, randomOffsetMs = 30 * 1e3, minRefreshIntervalMs = 60 * 1e3, retryDelayMs = 5 * 1e3 } = options ?? {};
		const controller = new AbortController();
		this.refreshControllers.set(appId, controller);
		const { signal } = controller;
		const loop = async () => {
			this.logger?.info?.(`[qqbot:token:${appId}] Background refresh started`);
			while (!signal.aborted) try {
				await this.getAccessToken(appId, clientSecret);
				const cached = this.cache.get(appId);
				if (cached) {
					const expiresIn = cached.expiresAt - Date.now();
					const randomOffset = Math.random() * randomOffsetMs;
					const refreshIn = Math.max(expiresIn - refreshAheadMs - randomOffset, minRefreshIntervalMs);
					this.logger?.debug?.(`[qqbot:token:${appId}] Next refresh in ${Math.round(refreshIn / 1e3)}s`);
					await this.abortableSleep(refreshIn, signal);
				} else await this.abortableSleep(minRefreshIntervalMs, signal);
			} catch (err) {
				if (signal.aborted) break;
				this.logger?.error?.(`[qqbot:token:${appId}] Background refresh failed: ${formatErrorMessage(err)}`);
				await this.abortableSleep(retryDelayMs, signal);
			}
			this.refreshControllers.delete(appId);
			this.logger?.info?.(`[qqbot:token:${appId}] Background refresh stopped`);
		};
		loop().catch((err) => {
			if (this.refreshControllers.has(appId)) {
				this.refreshControllers.delete(appId);
				this.logger?.error?.(`[qqbot:token:${appId}] Background refresh crashed: ${formatErrorMessage(err)}`);
			}
		});
	}
	stopBackgroundRefresh(appId) {
		if (appId) {
			const ctrl = this.refreshControllers.get(appId);
			if (ctrl) {
				ctrl.abort();
				this.refreshControllers.delete(appId);
			}
		} else {
			for (const ctrl of this.refreshControllers.values()) ctrl.abort();
			this.refreshControllers.clear();
		}
	}
	isBackgroundRefreshRunning(appId) {
		if (appId) return this.refreshControllers.has(appId);
		return this.refreshControllers.size > 0;
	}
	async doFetchToken(appId, clientSecret) {
		const url = `${this.baseUrl}${TOKEN_PATH}`;
		this.logger?.debug?.(`[qqbot:token:${appId}] >>> POST ${url}`);
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), DEFAULT_TOKEN_TIMEOUT_MS);
		let response;
		try {
			response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"User-Agent": this.resolveUserAgent()
				},
				body: JSON.stringify({
					appId,
					clientSecret
				}),
				signal: controller.signal
			});
		} catch (err) {
			this.logger?.error?.(`[qqbot:token:${appId}] Network error: ${formatErrorMessage(err)}`);
			throw new Error(`Network error getting access_token: ${formatErrorMessage(err)}`, { cause: err });
		} finally {
			clearTimeout(timeout);
		}
		const traceId = response.headers.get("x-tps-trace-id") ?? "";
		this.logger?.debug?.(`[qqbot:token:${appId}] <<< ${response.status}${traceId ? ` | TraceId: ${traceId}` : ""}`);
		if (!response.ok) {
			const errorBody = await response.text().catch(() => "");
			throw new Error(`Token fetch failed: HTTP ${response.status}${errorBody ? ` — ${errorBody.slice(0, 200)}` : ""}`);
		}
		let data;
		try {
			const rawBody = await response.text();
			const logBody = rawBody.replace(/"access_token"\s*:\s*"[^"]+"/g, "\"access_token\": \"***\"");
			this.logger?.debug?.(`[qqbot:token:${appId}] <<< Body: ${logBody}`);
			data = JSON.parse(rawBody);
		} catch (err) {
			throw new Error(`Failed to parse access_token response: ${formatErrorMessage(err)}`, { cause: err });
		}
		if (!data.access_token) throw new Error(`Failed to get access_token: ${JSON.stringify(data)}`);
		const expiresAt = Date.now() + (data.expires_in ?? 7200) * 1e3;
		this.cache.set(appId, {
			token: data.access_token,
			expiresAt,
			appId
		});
		this.logger?.debug?.(`[qqbot:token:${appId}] Cached, expires at: ${new Date(expiresAt).toISOString()}`);
		return data.access_token;
	}
	abortableSleep(ms, signal) {
		return new Promise((resolve$1, reject) => {
			if (signal.aborted) {
				reject(signal.reason ?? new DOMException("The operation was aborted", "AbortError"));
				return;
			}
			const timer = setTimeout(() => {
				signal.removeEventListener("abort", onAbort);
				resolve$1();
			}, ms);
			const onAbort = () => {
				clearTimeout(timer);
				reject(signal.reason ?? new DOMException("The operation was aborted", "AbortError"));
			};
			signal.addEventListener("abort", onAbort, { once: true });
		});
	}
};

//#endregion
//#region node_modules/ws/lib/constants.js
var require_constants = __commonJS({ "node_modules/ws/lib/constants.js"(exports, module) {
	const BINARY_TYPES$2 = [
		"nodebuffer",
		"arraybuffer",
		"fragments"
	];
	const hasBlob$1 = typeof Blob !== "undefined";
	if (hasBlob$1) BINARY_TYPES$2.push("blob");
	module.exports = {
		BINARY_TYPES: BINARY_TYPES$2,
		CLOSE_TIMEOUT: 3e4,
		EMPTY_BUFFER: Buffer.alloc(0),
		GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
		hasBlob: hasBlob$1,
		kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
		kListener: Symbol("kListener"),
		kStatusCode: Symbol("status-code"),
		kWebSocket: Symbol("websocket"),
		NOOP: () => {}
	};
} });

//#endregion
//#region node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({ "node_modules/ws/lib/buffer-util.js"(exports, module) {
	const { EMPTY_BUFFER: EMPTY_BUFFER$3 } = require_constants();
	const FastBuffer$2 = Buffer[Symbol.species];
	/**
	* Merges an array of buffers into a new buffer.
	*
	* @param {Buffer[]} list The array of buffers to concat
	* @param {Number} totalLength The total length of buffers in the list
	* @return {Buffer} The resulting buffer
	* @public
	*/
	function concat$1(list, totalLength) {
		if (list.length === 0) return EMPTY_BUFFER$3;
		if (list.length === 1) return list[0];
		const target = Buffer.allocUnsafe(totalLength);
		let offset = 0;
		for (let i = 0; i < list.length; i++) {
			const buf = list[i];
			target.set(buf, offset);
			offset += buf.length;
		}
		if (offset < totalLength) return new FastBuffer$2(target.buffer, target.byteOffset, offset);
		return target;
	}
	/**
	* Masks a buffer using the given mask.
	*
	* @param {Buffer} source The buffer to mask
	* @param {Buffer} mask The mask to use
	* @param {Buffer} output The buffer where to store the result
	* @param {Number} offset The offset at which to start writing
	* @param {Number} length The number of bytes to mask.
	* @public
	*/
	function _mask(source, mask, output, offset, length) {
		for (let i = 0; i < length; i++) output[offset + i] = source[i] ^ mask[i & 3];
	}
	/**
	* Unmasks a buffer using the given mask.
	*
	* @param {Buffer} buffer The buffer to unmask
	* @param {Buffer} mask The mask to use
	* @public
	*/
	function _unmask(buffer, mask) {
		for (let i = 0; i < buffer.length; i++) buffer[i] ^= mask[i & 3];
	}
	/**
	* Converts a buffer to an `ArrayBuffer`.
	*
	* @param {Buffer} buf The buffer to convert
	* @return {ArrayBuffer} Converted buffer
	* @public
	*/
	function toArrayBuffer$1(buf) {
		if (buf.length === buf.buffer.byteLength) return buf.buffer;
		return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
	}
	/**
	* Converts `data` to a `Buffer`.
	*
	* @param {*} data The data to convert
	* @return {Buffer} The buffer
	* @throws {TypeError}
	* @public
	*/
	function toBuffer$2(data) {
		toBuffer$2.readOnly = true;
		if (Buffer.isBuffer(data)) return data;
		let buf;
		if (data instanceof ArrayBuffer) buf = new FastBuffer$2(data);
		else if (ArrayBuffer.isView(data)) buf = new FastBuffer$2(data.buffer, data.byteOffset, data.byteLength);
		else {
			buf = Buffer.from(data);
			toBuffer$2.readOnly = false;
		}
		return buf;
	}
	module.exports = {
		concat: concat$1,
		mask: _mask,
		toArrayBuffer: toArrayBuffer$1,
		toBuffer: toBuffer$2,
		unmask: _unmask
	};
	/* istanbul ignore else  */
	if (!process.env.WS_NO_BUFFER_UTIL) try {
		const bufferUtil$1 = __require("bufferutil");
		module.exports.mask = function(source, mask, output, offset, length) {
			if (length < 48) _mask(source, mask, output, offset, length);
			else bufferUtil$1.mask(source, mask, output, offset, length);
		};
		module.exports.unmask = function(buffer, mask) {
			if (buffer.length < 32) _unmask(buffer, mask);
			else bufferUtil$1.unmask(buffer, mask);
		};
	} catch (e) {}
} });

//#endregion
//#region node_modules/ws/lib/limiter.js
var require_limiter = __commonJS({ "node_modules/ws/lib/limiter.js"(exports, module) {
	const kDone = Symbol("kDone");
	const kRun = Symbol("kRun");
	/**
	* A very simple job queue with adjustable concurrency. Adapted from
	* https://github.com/STRML/async-limiter
	*/
	var Limiter$1 = class {
		/**
		* Creates a new `Limiter`.
		*
		* @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
		*     to run concurrently
		*/
		constructor(concurrency) {
			this[kDone] = () => {
				this.pending--;
				this[kRun]();
			};
			this.concurrency = concurrency || Infinity;
			this.jobs = [];
			this.pending = 0;
		}
		/**
		* Adds a job to the queue.
		*
		* @param {Function} job The job to run
		* @public
		*/
		add(job) {
			this.jobs.push(job);
			this[kRun]();
		}
		/**
		* Removes a job from the queue and runs it if possible.
		*
		* @private
		*/
		[kRun]() {
			if (this.pending === this.concurrency) return;
			if (this.jobs.length) {
				const job = this.jobs.shift();
				this.pending++;
				job(this[kDone]);
			}
		}
	};
	module.exports = Limiter$1;
} });

//#endregion
//#region node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({ "node_modules/ws/lib/permessage-deflate.js"(exports, module) {
	const zlib = __require("zlib");
	const bufferUtil = require_buffer_util();
	const Limiter = require_limiter();
	const { kStatusCode: kStatusCode$2 } = require_constants();
	const FastBuffer$1 = Buffer[Symbol.species];
	const TRAILER = Buffer.from([
		0,
		0,
		255,
		255
	]);
	const kPerMessageDeflate = Symbol("permessage-deflate");
	const kTotalLength = Symbol("total-length");
	const kCallback = Symbol("callback");
	const kBuffers = Symbol("buffers");
	const kError$1 = Symbol("error");
	let zlibLimiter;
	/**
	* permessage-deflate implementation.
	*/
	var PerMessageDeflate$4 = class {
		/**
		* Creates a PerMessageDeflate instance.
		*
		* @param {Object} [options] Configuration options
		* @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
		*     for, or request, a custom client window size
		* @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
		*     acknowledge disabling of client context takeover
		* @param {Number} [options.concurrencyLimit=10] The number of concurrent
		*     calls to zlib
		* @param {Boolean} [options.isServer=false] Create the instance in either
		*     server or client mode
		* @param {Number} [options.maxPayload=0] The maximum allowed message length
		* @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
		*     use of a custom server window size
		* @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
		*     disabling of server context takeover
		* @param {Number} [options.threshold=1024] Size (in bytes) below which
		*     messages should not be compressed if context takeover is disabled
		* @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
		*     deflate
		* @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
		*     inflate
		*/
		constructor(options) {
			this._options = options || {};
			this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
			this._maxPayload = this._options.maxPayload | 0;
			this._isServer = !!this._options.isServer;
			this._deflate = null;
			this._inflate = null;
			this.params = null;
			if (!zlibLimiter) {
				const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
				zlibLimiter = new Limiter(concurrency);
			}
		}
		/**
		* @type {String}
		*/
		static get extensionName() {
			return "permessage-deflate";
		}
		/**
		* Create an extension negotiation offer.
		*
		* @return {Object} Extension parameters
		* @public
		*/
		offer() {
			const params = {};
			if (this._options.serverNoContextTakeover) params.server_no_context_takeover = true;
			if (this._options.clientNoContextTakeover) params.client_no_context_takeover = true;
			if (this._options.serverMaxWindowBits) params.server_max_window_bits = this._options.serverMaxWindowBits;
			if (this._options.clientMaxWindowBits) params.client_max_window_bits = this._options.clientMaxWindowBits;
			else if (this._options.clientMaxWindowBits == null) params.client_max_window_bits = true;
			return params;
		}
		/**
		* Accept an extension negotiation offer/response.
		*
		* @param {Array} configurations The extension negotiation offers/reponse
		* @return {Object} Accepted configuration
		* @public
		*/
		accept(configurations) {
			configurations = this.normalizeParams(configurations);
			this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
			return this.params;
		}
		/**
		* Releases all resources used by the extension.
		*
		* @public
		*/
		cleanup() {
			if (this._inflate) {
				this._inflate.close();
				this._inflate = null;
			}
			if (this._deflate) {
				const callback = this._deflate[kCallback];
				this._deflate.close();
				this._deflate = null;
				if (callback) callback(new Error("The deflate stream was closed while data was being processed"));
			}
		}
		/**
		*  Accept an extension negotiation offer.
		*
		* @param {Array} offers The extension negotiation offers
		* @return {Object} Accepted configuration
		* @private
		*/
		acceptAsServer(offers) {
			const opts = this._options;
			const accepted = offers.find((params) => {
				if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && (typeof params.client_max_window_bits === "number" ? opts.clientMaxWindowBits > params.client_max_window_bits : !params.client_max_window_bits)) return false;
				return true;
			});
			if (!accepted) throw new Error("None of the extension offers can be accepted");
			if (opts.serverNoContextTakeover) accepted.server_no_context_takeover = true;
			if (opts.clientNoContextTakeover) accepted.client_no_context_takeover = true;
			if (typeof opts.serverMaxWindowBits === "number") accepted.server_max_window_bits = opts.serverMaxWindowBits;
			if (typeof opts.clientMaxWindowBits === "number") accepted.client_max_window_bits = opts.clientMaxWindowBits;
			else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) delete accepted.client_max_window_bits;
			return accepted;
		}
		/**
		* Accept the extension negotiation response.
		*
		* @param {Array} response The extension negotiation response
		* @return {Object} Accepted configuration
		* @private
		*/
		acceptAsClient(response) {
			const params = response[0];
			if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) throw new Error("Unexpected parameter \"client_no_context_takeover\"");
			if (!params.client_max_window_bits) {
				if (typeof this._options.clientMaxWindowBits === "number") params.client_max_window_bits = this._options.clientMaxWindowBits;
			} else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) throw new Error("Unexpected or invalid parameter \"client_max_window_bits\"");
			return params;
		}
		/**
		* Normalize parameters.
		*
		* @param {Array} configurations The extension negotiation offers/reponse
		* @return {Array} The offers/response with normalized parameters
		* @private
		*/
		normalizeParams(configurations) {
			configurations.forEach((params) => {
				Object.keys(params).forEach((key) => {
					let value = params[key];
					if (value.length > 1) throw new Error(`Parameter "${key}" must have only a single value`);
					value = value[0];
					if (key === "client_max_window_bits") {
						if (value !== true) {
							const num = +value;
							if (!Number.isInteger(num) || num < 8 || num > 15) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
							value = num;
						} else if (!this._isServer) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
					} else if (key === "server_max_window_bits") {
						const num = +value;
						if (!Number.isInteger(num) || num < 8 || num > 15) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
						value = num;
					} else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
						if (value !== true) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
					} else throw new Error(`Unknown parameter "${key}"`);
					params[key] = value;
				});
			});
			return configurations;
		}
		/**
		* Decompress data. Concurrency limited.
		*
		* @param {Buffer} data Compressed data
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @public
		*/
		decompress(data, fin, callback) {
			zlibLimiter.add((done) => {
				this._decompress(data, fin, (err, result) => {
					done();
					callback(err, result);
				});
			});
		}
		/**
		* Compress data. Concurrency limited.
		*
		* @param {(Buffer|String)} data Data to compress
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @public
		*/
		compress(data, fin, callback) {
			zlibLimiter.add((done) => {
				this._compress(data, fin, (err, result) => {
					done();
					callback(err, result);
				});
			});
		}
		/**
		* Decompress data.
		*
		* @param {Buffer} data Compressed data
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @private
		*/
		_decompress(data, fin, callback) {
			const endpoint = this._isServer ? "client" : "server";
			if (!this._inflate) {
				const key = `${endpoint}_max_window_bits`;
				const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
				this._inflate = zlib.createInflateRaw({
					...this._options.zlibInflateOptions,
					windowBits
				});
				this._inflate[kPerMessageDeflate] = this;
				this._inflate[kTotalLength] = 0;
				this._inflate[kBuffers] = [];
				this._inflate.on("error", inflateOnError);
				this._inflate.on("data", inflateOnData);
			}
			this._inflate[kCallback] = callback;
			this._inflate.write(data);
			if (fin) this._inflate.write(TRAILER);
			this._inflate.flush(() => {
				const err = this._inflate[kError$1];
				if (err) {
					this._inflate.close();
					this._inflate = null;
					callback(err);
					return;
				}
				const data$1 = bufferUtil.concat(this._inflate[kBuffers], this._inflate[kTotalLength]);
				if (this._inflate._readableState.endEmitted) {
					this._inflate.close();
					this._inflate = null;
				} else {
					this._inflate[kTotalLength] = 0;
					this._inflate[kBuffers] = [];
					if (fin && this.params[`${endpoint}_no_context_takeover`]) this._inflate.reset();
				}
				callback(null, data$1);
			});
		}
		/**
		* Compress data.
		*
		* @param {(Buffer|String)} data Data to compress
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @private
		*/
		_compress(data, fin, callback) {
			const endpoint = this._isServer ? "server" : "client";
			if (!this._deflate) {
				const key = `${endpoint}_max_window_bits`;
				const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
				this._deflate = zlib.createDeflateRaw({
					...this._options.zlibDeflateOptions,
					windowBits
				});
				this._deflate[kTotalLength] = 0;
				this._deflate[kBuffers] = [];
				this._deflate.on("data", deflateOnData);
			}
			this._deflate[kCallback] = callback;
			this._deflate.write(data);
			this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
				if (!this._deflate) return;
				let data$1 = bufferUtil.concat(this._deflate[kBuffers], this._deflate[kTotalLength]);
				if (fin) data$1 = new FastBuffer$1(data$1.buffer, data$1.byteOffset, data$1.length - 4);
				this._deflate[kCallback] = null;
				this._deflate[kTotalLength] = 0;
				this._deflate[kBuffers] = [];
				if (fin && this.params[`${endpoint}_no_context_takeover`]) this._deflate.reset();
				callback(null, data$1);
			});
		}
	};
	module.exports = PerMessageDeflate$4;
	/**
	* The listener of the `zlib.DeflateRaw` stream `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function deflateOnData(chunk) {
		this[kBuffers].push(chunk);
		this[kTotalLength] += chunk.length;
	}
	/**
	* The listener of the `zlib.InflateRaw` stream `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function inflateOnData(chunk) {
		this[kTotalLength] += chunk.length;
		if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
			this[kBuffers].push(chunk);
			return;
		}
		this[kError$1] = new RangeError("Max payload size exceeded");
		this[kError$1].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
		this[kError$1][kStatusCode$2] = 1009;
		this.removeListener("data", inflateOnData);
		this.reset();
	}
	/**
	* The listener of the `zlib.InflateRaw` stream `'error'` event.
	*
	* @param {Error} err The emitted error
	* @private
	*/
	function inflateOnError(err) {
		this[kPerMessageDeflate]._inflate = null;
		if (this[kError$1]) {
			this[kCallback](this[kError$1]);
			return;
		}
		err[kStatusCode$2] = 1007;
		this[kCallback](err);
	}
} });

//#endregion
//#region node_modules/ws/lib/validation.js
var require_validation = __commonJS({ "node_modules/ws/lib/validation.js"(exports, module) {
	const { isUtf8 } = __require("buffer");
	const { hasBlob } = require_constants();
	const tokenChars$2 = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		0,
		1,
		0
	];
	/**
	* Checks if a status code is allowed in a close frame.
	*
	* @param {Number} code The status code
	* @return {Boolean} `true` if the status code is valid, else `false`
	* @public
	*/
	function isValidStatusCode$2(code) {
		return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
	}
	/**
	* Checks if a given buffer contains only correct UTF-8.
	* Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
	* Markus Kuhn.
	*
	* @param {Buffer} buf The buffer to check
	* @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
	* @public
	*/
	function _isValidUTF8(buf) {
		const len = buf.length;
		let i = 0;
		while (i < len) if ((buf[i] & 128) === 0) i++;
		else if ((buf[i] & 224) === 192) {
			if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) return false;
			i += 2;
		} else if ((buf[i] & 240) === 224) {
			if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || buf[i] === 237 && (buf[i + 1] & 224) === 160) return false;
			i += 3;
		} else if ((buf[i] & 248) === 240) {
			if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) return false;
			i += 4;
		} else return false;
		return true;
	}
	/**
	* Determines whether a value is a `Blob`.
	*
	* @param {*} value The value to be tested
	* @return {Boolean} `true` if `value` is a `Blob`, else `false`
	* @private
	*/
	function isBlob$2(value) {
		return hasBlob && typeof value === "object" && typeof value.arrayBuffer === "function" && typeof value.type === "string" && typeof value.stream === "function" && (value[Symbol.toStringTag] === "Blob" || value[Symbol.toStringTag] === "File");
	}
	module.exports = {
		isBlob: isBlob$2,
		isValidStatusCode: isValidStatusCode$2,
		isValidUTF8: _isValidUTF8,
		tokenChars: tokenChars$2
	};
	if (isUtf8) module.exports.isValidUTF8 = function(buf) {
		return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
	};
	else if (!process.env.WS_NO_UTF_8_VALIDATE) try {
		const isValidUTF8$1 = __require("utf-8-validate");
		module.exports.isValidUTF8 = function(buf) {
			return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8$1(buf);
		};
	} catch (e) {}
} });

//#endregion
//#region node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({ "node_modules/ws/lib/receiver.js"(exports, module) {
	const { Writable } = __require("stream");
	const PerMessageDeflate$3 = require_permessage_deflate();
	const { BINARY_TYPES: BINARY_TYPES$1, EMPTY_BUFFER: EMPTY_BUFFER$2, kStatusCode: kStatusCode$1, kWebSocket: kWebSocket$3 } = require_constants();
	const { concat, toArrayBuffer, unmask } = require_buffer_util();
	const { isValidStatusCode: isValidStatusCode$1, isValidUTF8 } = require_validation();
	const FastBuffer = Buffer[Symbol.species];
	const GET_INFO = 0;
	const GET_PAYLOAD_LENGTH_16 = 1;
	const GET_PAYLOAD_LENGTH_64 = 2;
	const GET_MASK = 3;
	const GET_DATA = 4;
	const INFLATING = 5;
	const DEFER_EVENT = 6;
	/**
	* HyBi Receiver implementation.
	*
	* @extends Writable
	*/
	var Receiver$1 = class extends Writable {
		/**
		* Creates a Receiver instance.
		*
		* @param {Object} [options] Options object
		* @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
		*     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
		*     multiple times in the same tick
		* @param {String} [options.binaryType=nodebuffer] The type for binary data
		* @param {Object} [options.extensions] An object containing the negotiated
		*     extensions
		* @param {Boolean} [options.isServer=false] Specifies whether to operate in
		*     client or server mode
		* @param {Number} [options.maxBufferedChunks=0] The maximum number of
		*     buffered data chunks
		* @param {Number} [options.maxFragments=0] The maximum number of message
		*     fragments
		* @param {Number} [options.maxPayload=0] The maximum allowed message length
		* @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
		*     not to skip UTF-8 validation for text and close messages
		*/
		constructor(options = {}) {
			super();
			this._allowSynchronousEvents = options.allowSynchronousEvents !== void 0 ? options.allowSynchronousEvents : true;
			this._binaryType = options.binaryType || BINARY_TYPES$1[0];
			this._extensions = options.extensions || {};
			this._isServer = !!options.isServer;
			this._maxBufferedChunks = options.maxBufferedChunks | 0;
			this._maxFragments = options.maxFragments | 0;
			this._maxPayload = options.maxPayload | 0;
			this._skipUTF8Validation = !!options.skipUTF8Validation;
			this[kWebSocket$3] = void 0;
			this._bufferedBytes = 0;
			this._buffers = [];
			this._compressed = false;
			this._payloadLength = 0;
			this._mask = void 0;
			this._fragmented = 0;
			this._masked = false;
			this._fin = false;
			this._opcode = 0;
			this._totalPayloadLength = 0;
			this._messageLength = 0;
			this._numFragments = 0;
			this._fragments = [];
			this._errored = false;
			this._loop = false;
			this._state = GET_INFO;
		}
		/**
		* Implements `Writable.prototype._write()`.
		*
		* @param {Buffer} chunk The chunk of data to write
		* @param {String} encoding The character encoding of `chunk`
		* @param {Function} cb Callback
		* @private
		*/
		_write(chunk, encoding, cb) {
			if (this._opcode === 8 && this._state == GET_INFO) return cb();
			if (this._maxBufferedChunks > 0 && this._buffers.length >= this._maxBufferedChunks) {
				cb(this.createError(RangeError, "Too many buffered chunks", false, 1008, "WS_ERR_TOO_MANY_BUFFERED_PARTS"));
				return;
			}
			this._bufferedBytes += chunk.length;
			this._buffers.push(chunk);
			this.startLoop(cb);
		}
		/**
		* Consumes `n` bytes from the buffered data.
		*
		* @param {Number} n The number of bytes to consume
		* @return {Buffer} The consumed bytes
		* @private
		*/
		consume(n) {
			this._bufferedBytes -= n;
			if (n === this._buffers[0].length) return this._buffers.shift();
			if (n < this._buffers[0].length) {
				const buf = this._buffers[0];
				this._buffers[0] = new FastBuffer(buf.buffer, buf.byteOffset + n, buf.length - n);
				return new FastBuffer(buf.buffer, buf.byteOffset, n);
			}
			const dst = Buffer.allocUnsafe(n);
			do {
				const buf = this._buffers[0];
				const offset = dst.length - n;
				if (n >= buf.length) dst.set(this._buffers.shift(), offset);
				else {
					dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
					this._buffers[0] = new FastBuffer(buf.buffer, buf.byteOffset + n, buf.length - n);
				}
				n -= buf.length;
			} while (n > 0);
			return dst;
		}
		/**
		* Starts the parsing loop.
		*
		* @param {Function} cb Callback
		* @private
		*/
		startLoop(cb) {
			this._loop = true;
			do
				switch (this._state) {
					case GET_INFO:
						this.getInfo(cb);
						break;
					case GET_PAYLOAD_LENGTH_16:
						this.getPayloadLength16(cb);
						break;
					case GET_PAYLOAD_LENGTH_64:
						this.getPayloadLength64(cb);
						break;
					case GET_MASK:
						this.getMask();
						break;
					case GET_DATA:
						this.getData(cb);
						break;
					case INFLATING:
					case DEFER_EVENT:
						this._loop = false;
						return;
				}
			while (this._loop);
			if (!this._errored) cb();
		}
		/**
		* Reads the first two bytes of a frame.
		*
		* @param {Function} cb Callback
		* @private
		*/
		getInfo(cb) {
			if (this._bufferedBytes < 2) {
				this._loop = false;
				return;
			}
			const buf = this.consume(2);
			if ((buf[0] & 48) !== 0) {
				const error = this.createError(RangeError, "RSV2 and RSV3 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_2_3");
				cb(error);
				return;
			}
			const compressed = (buf[0] & 64) === 64;
			if (compressed && !this._extensions[PerMessageDeflate$3.extensionName]) {
				const error = this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
				cb(error);
				return;
			}
			this._fin = (buf[0] & 128) === 128;
			this._opcode = buf[0] & 15;
			this._payloadLength = buf[1] & 127;
			if (this._opcode === 0) {
				if (compressed) {
					const error = this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
					cb(error);
					return;
				}
				if (!this._fragmented) {
					const error = this.createError(RangeError, "invalid opcode 0", true, 1002, "WS_ERR_INVALID_OPCODE");
					cb(error);
					return;
				}
				this._opcode = this._fragmented;
			} else if (this._opcode === 1 || this._opcode === 2) {
				if (this._fragmented) {
					const error = this.createError(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE");
					cb(error);
					return;
				}
				this._compressed = compressed;
			} else if (this._opcode > 7 && this._opcode < 11) {
				if (!this._fin) {
					const error = this.createError(RangeError, "FIN must be set", true, 1002, "WS_ERR_EXPECTED_FIN");
					cb(error);
					return;
				}
				if (compressed) {
					const error = this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
					cb(error);
					return;
				}
				if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
					const error = this.createError(RangeError, `invalid payload length ${this._payloadLength}`, true, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH");
					cb(error);
					return;
				}
			} else {
				const error = this.createError(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE");
				cb(error);
				return;
			}
			if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
			this._masked = (buf[1] & 128) === 128;
			if (this._isServer) {
				if (!this._masked) {
					const error = this.createError(RangeError, "MASK must be set", true, 1002, "WS_ERR_EXPECTED_MASK");
					cb(error);
					return;
				}
			} else if (this._masked) {
				const error = this.createError(RangeError, "MASK must be clear", true, 1002, "WS_ERR_UNEXPECTED_MASK");
				cb(error);
				return;
			}
			if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
			else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
			else this.haveLength(cb);
		}
		/**
		* Gets extended payload length (7+16).
		*
		* @param {Function} cb Callback
		* @private
		*/
		getPayloadLength16(cb) {
			if (this._bufferedBytes < 2) {
				this._loop = false;
				return;
			}
			this._payloadLength = this.consume(2).readUInt16BE(0);
			this.haveLength(cb);
		}
		/**
		* Gets extended payload length (7+64).
		*
		* @param {Function} cb Callback
		* @private
		*/
		getPayloadLength64(cb) {
			if (this._bufferedBytes < 8) {
				this._loop = false;
				return;
			}
			const buf = this.consume(8);
			const num = buf.readUInt32BE(0);
			if (num > Math.pow(2, 21) - 1) {
				const error = this.createError(RangeError, "Unsupported WebSocket frame: payload length > 2^53 - 1", false, 1009, "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH");
				cb(error);
				return;
			}
			this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
			this.haveLength(cb);
		}
		/**
		* Payload length has been read.
		*
		* @param {Function} cb Callback
		* @private
		*/
		haveLength(cb) {
			if (this._payloadLength && this._opcode < 8) {
				this._totalPayloadLength += this._payloadLength;
				if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
					const error = this.createError(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
					cb(error);
					return;
				}
			}
			if (this._masked) this._state = GET_MASK;
			else this._state = GET_DATA;
		}
		/**
		* Reads mask bytes.
		*
		* @private
		*/
		getMask() {
			if (this._bufferedBytes < 4) {
				this._loop = false;
				return;
			}
			this._mask = this.consume(4);
			this._state = GET_DATA;
		}
		/**
		* Reads data bytes.
		*
		* @param {Function} cb Callback
		* @private
		*/
		getData(cb) {
			let data = EMPTY_BUFFER$2;
			if (this._payloadLength) {
				if (this._bufferedBytes < this._payloadLength) {
					this._loop = false;
					return;
				}
				data = this.consume(this._payloadLength);
				if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) unmask(data, this._mask);
			}
			if (this._opcode > 7) {
				this.controlMessage(data, cb);
				return;
			}
			if (this._maxFragments > 0 && ++this._numFragments > this._maxFragments) {
				const error = this.createError(RangeError, "Too many message fragments", false, 1008, "WS_ERR_TOO_MANY_BUFFERED_PARTS");
				cb(error);
				return;
			}
			if (this._compressed) {
				this._state = INFLATING;
				this.decompress(data, cb);
				return;
			}
			if (data.length) {
				this._messageLength = this._totalPayloadLength;
				this._fragments.push(data);
			}
			this.dataMessage(cb);
		}
		/**
		* Decompresses data.
		*
		* @param {Buffer} data Compressed data
		* @param {Function} cb Callback
		* @private
		*/
		decompress(data, cb) {
			const perMessageDeflate = this._extensions[PerMessageDeflate$3.extensionName];
			perMessageDeflate.decompress(data, this._fin, (err, buf) => {
				if (err) return cb(err);
				if (buf.length) {
					this._messageLength += buf.length;
					if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
						const error = this.createError(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
						cb(error);
						return;
					}
					this._fragments.push(buf);
				}
				this.dataMessage(cb);
				if (this._state === GET_INFO) this.startLoop(cb);
			});
		}
		/**
		* Handles a data message.
		*
		* @param {Function} cb Callback
		* @private
		*/
		dataMessage(cb) {
			if (!this._fin) {
				this._state = GET_INFO;
				return;
			}
			const messageLength = this._messageLength;
			const fragments = this._fragments;
			this._totalPayloadLength = 0;
			this._messageLength = 0;
			this._fragmented = 0;
			this._numFragments = 0;
			this._fragments = [];
			if (this._opcode === 2) {
				let data;
				if (this._binaryType === "nodebuffer") data = concat(fragments, messageLength);
				else if (this._binaryType === "arraybuffer") data = toArrayBuffer(concat(fragments, messageLength));
				else if (this._binaryType === "blob") data = new Blob(fragments);
				else data = fragments;
				if (this._allowSynchronousEvents) {
					this.emit("message", data, true);
					this._state = GET_INFO;
				} else {
					this._state = DEFER_EVENT;
					setImmediate(() => {
						this.emit("message", data, true);
						this._state = GET_INFO;
						this.startLoop(cb);
					});
				}
			} else {
				const buf = concat(fragments, messageLength);
				if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
					const error = this.createError(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8");
					cb(error);
					return;
				}
				if (this._state === INFLATING || this._allowSynchronousEvents) {
					this.emit("message", buf, false);
					this._state = GET_INFO;
				} else {
					this._state = DEFER_EVENT;
					setImmediate(() => {
						this.emit("message", buf, false);
						this._state = GET_INFO;
						this.startLoop(cb);
					});
				}
			}
		}
		/**
		* Handles a control message.
		*
		* @param {Buffer} data Data to handle
		* @return {(Error|RangeError|undefined)} A possible error
		* @private
		*/
		controlMessage(data, cb) {
			if (this._opcode === 8) {
				if (data.length === 0) {
					this._loop = false;
					this.emit("conclude", 1005, EMPTY_BUFFER$2);
					this.end();
				} else {
					const code = data.readUInt16BE(0);
					if (!isValidStatusCode$1(code)) {
						const error = this.createError(RangeError, `invalid status code ${code}`, true, 1002, "WS_ERR_INVALID_CLOSE_CODE");
						cb(error);
						return;
					}
					const buf = new FastBuffer(data.buffer, data.byteOffset + 2, data.length - 2);
					if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
						const error = this.createError(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8");
						cb(error);
						return;
					}
					this._loop = false;
					this.emit("conclude", code, buf);
					this.end();
				}
				this._state = GET_INFO;
				return;
			}
			if (this._allowSynchronousEvents) {
				this.emit(this._opcode === 9 ? "ping" : "pong", data);
				this._state = GET_INFO;
			} else {
				this._state = DEFER_EVENT;
				setImmediate(() => {
					this.emit(this._opcode === 9 ? "ping" : "pong", data);
					this._state = GET_INFO;
					this.startLoop(cb);
				});
			}
		}
		/**
		* Builds an error object.
		*
		* @param {function(new:Error|RangeError)} ErrorCtor The error constructor
		* @param {String} message The error message
		* @param {Boolean} prefix Specifies whether or not to add a default prefix to
		*     `message`
		* @param {Number} statusCode The status code
		* @param {String} errorCode The exposed error code
		* @return {(Error|RangeError)} The error
		* @private
		*/
		createError(ErrorCtor, message, prefix, statusCode, errorCode) {
			this._loop = false;
			this._errored = true;
			const err = new ErrorCtor(prefix ? `Invalid WebSocket frame: ${message}` : message);
			Error.captureStackTrace(err, this.createError);
			err.code = errorCode;
			err[kStatusCode$1] = statusCode;
			return err;
		}
	};
	module.exports = Receiver$1;
} });

//#endregion
//#region node_modules/ws/lib/sender.js
var require_sender = __commonJS({ "node_modules/ws/lib/sender.js"(exports, module) {
	const { Duplex: Duplex$3 } = __require("stream");
	const { randomFillSync } = __require("crypto");
	const { types: { isUint8Array } } = __require("util");
	const PerMessageDeflate$2 = require_permessage_deflate();
	const { EMPTY_BUFFER: EMPTY_BUFFER$1, kWebSocket: kWebSocket$2, NOOP: NOOP$1 } = require_constants();
	const { isBlob: isBlob$1, isValidStatusCode } = require_validation();
	const { mask: applyMask, toBuffer: toBuffer$1 } = require_buffer_util();
	const kByteLength = Symbol("kByteLength");
	const maskBuffer = Buffer.alloc(4);
	const RANDOM_POOL_SIZE = 8 * 1024;
	let randomPool;
	let randomPoolPointer = RANDOM_POOL_SIZE;
	const DEFAULT = 0;
	const DEFLATING = 1;
	const GET_BLOB_DATA = 2;
	/**
	* HyBi Sender implementation.
	*/
	var Sender$1 = class Sender$1 {
		/**
		* Creates a Sender instance.
		*
		* @param {Duplex} socket The connection socket
		* @param {Object} [extensions] An object containing the negotiated extensions
		* @param {Function} [generateMask] The function used to generate the masking
		*     key
		*/
		constructor(socket, extensions, generateMask) {
			this._extensions = extensions || {};
			if (generateMask) {
				this._generateMask = generateMask;
				this._maskBuffer = Buffer.alloc(4);
			}
			this._socket = socket;
			this._firstFragment = true;
			this._compress = false;
			this._bufferedBytes = 0;
			this._queue = [];
			this._state = DEFAULT;
			this.onerror = NOOP$1;
			this[kWebSocket$2] = void 0;
		}
		/**
		* Frames a piece of data according to the HyBi WebSocket protocol.
		*
		* @param {(Buffer|String)} data The data to frame
		* @param {Object} options Options object
		* @param {Boolean} [options.fin=false] Specifies whether or not to set the
		*     FIN bit
		* @param {Function} [options.generateMask] The function used to generate the
		*     masking key
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Buffer} [options.maskBuffer] The buffer used to store the masking
		*     key
		* @param {Number} options.opcode The opcode
		* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
		*     modified
		* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
		*     RSV1 bit
		* @return {(Buffer|String)[]} The framed data
		* @public
		*/
		static frame(data, options) {
			let mask;
			let merge = false;
			let offset = 2;
			let skipMasking = false;
			if (options.mask) {
				mask = options.maskBuffer || maskBuffer;
				if (options.generateMask) options.generateMask(mask);
				else {
					if (randomPoolPointer === RANDOM_POOL_SIZE) {
						/* istanbul ignore else  */
						if (randomPool === void 0) randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
						randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
						randomPoolPointer = 0;
					}
					mask[0] = randomPool[randomPoolPointer++];
					mask[1] = randomPool[randomPoolPointer++];
					mask[2] = randomPool[randomPoolPointer++];
					mask[3] = randomPool[randomPoolPointer++];
				}
				skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
				offset = 6;
			}
			let dataLength;
			if (typeof data === "string") if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) dataLength = options[kByteLength];
			else {
				data = Buffer.from(data);
				dataLength = data.length;
			}
			else {
				dataLength = data.length;
				merge = options.mask && options.readOnly && !skipMasking;
			}
			let payloadLength = dataLength;
			if (dataLength >= 65536) {
				offset += 8;
				payloadLength = 127;
			} else if (dataLength > 125) {
				offset += 2;
				payloadLength = 126;
			}
			const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
			target[0] = options.fin ? options.opcode | 128 : options.opcode;
			if (options.rsv1) target[0] |= 64;
			target[1] = payloadLength;
			if (payloadLength === 126) target.writeUInt16BE(dataLength, 2);
			else if (payloadLength === 127) {
				target[2] = target[3] = 0;
				target.writeUIntBE(dataLength, 4, 6);
			}
			if (!options.mask) return [target, data];
			target[1] |= 128;
			target[offset - 4] = mask[0];
			target[offset - 3] = mask[1];
			target[offset - 2] = mask[2];
			target[offset - 1] = mask[3];
			if (skipMasking) return [target, data];
			if (merge) {
				applyMask(data, mask, target, offset, dataLength);
				return [target];
			}
			applyMask(data, mask, data, 0, dataLength);
			return [target, data];
		}
		/**
		* Sends a close message to the other peer.
		*
		* @param {Number} [code] The status code component of the body
		* @param {(String|Buffer)} [data] The message component of the body
		* @param {Boolean} [mask=false] Specifies whether or not to mask the message
		* @param {Function} [cb] Callback
		* @public
		*/
		close(code, data, mask, cb) {
			let buf;
			if (code === void 0) buf = EMPTY_BUFFER$1;
			else if (typeof code !== "number" || !isValidStatusCode(code)) throw new TypeError("First argument must be a valid error code number");
			else if (data === void 0 || !data.length) {
				buf = Buffer.allocUnsafe(2);
				buf.writeUInt16BE(code, 0);
			} else {
				const length = Buffer.byteLength(data);
				if (length > 123) throw new RangeError("The message must not be greater than 123 bytes");
				buf = Buffer.allocUnsafe(2 + length);
				buf.writeUInt16BE(code, 0);
				if (typeof data === "string") buf.write(data, 2);
				else if (isUint8Array(data)) buf.set(data, 2);
				else throw new TypeError("Second argument must be a string or a Uint8Array");
			}
			const options = {
				[kByteLength]: buf.length,
				fin: true,
				generateMask: this._generateMask,
				mask,
				maskBuffer: this._maskBuffer,
				opcode: 8,
				readOnly: false,
				rsv1: false
			};
			if (this._state !== DEFAULT) this.enqueue([
				this.dispatch,
				buf,
				false,
				options,
				cb
			]);
			else this.sendFrame(Sender$1.frame(buf, options), cb);
		}
		/**
		* Sends a ping message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		ping(data, mask, cb) {
			let byteLength;
			let readOnly;
			if (typeof data === "string") {
				byteLength = Buffer.byteLength(data);
				readOnly = false;
			} else if (isBlob$1(data)) {
				byteLength = data.size;
				readOnly = false;
			} else {
				data = toBuffer$1(data);
				byteLength = data.length;
				readOnly = toBuffer$1.readOnly;
			}
			if (byteLength > 125) throw new RangeError("The data size must not be greater than 125 bytes");
			const options = {
				[kByteLength]: byteLength,
				fin: true,
				generateMask: this._generateMask,
				mask,
				maskBuffer: this._maskBuffer,
				opcode: 9,
				readOnly,
				rsv1: false
			};
			if (isBlob$1(data)) if (this._state !== DEFAULT) this.enqueue([
				this.getBlobData,
				data,
				false,
				options,
				cb
			]);
			else this.getBlobData(data, false, options, cb);
			else if (this._state !== DEFAULT) this.enqueue([
				this.dispatch,
				data,
				false,
				options,
				cb
			]);
			else this.sendFrame(Sender$1.frame(data, options), cb);
		}
		/**
		* Sends a pong message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		pong(data, mask, cb) {
			let byteLength;
			let readOnly;
			if (typeof data === "string") {
				byteLength = Buffer.byteLength(data);
				readOnly = false;
			} else if (isBlob$1(data)) {
				byteLength = data.size;
				readOnly = false;
			} else {
				data = toBuffer$1(data);
				byteLength = data.length;
				readOnly = toBuffer$1.readOnly;
			}
			if (byteLength > 125) throw new RangeError("The data size must not be greater than 125 bytes");
			const options = {
				[kByteLength]: byteLength,
				fin: true,
				generateMask: this._generateMask,
				mask,
				maskBuffer: this._maskBuffer,
				opcode: 10,
				readOnly,
				rsv1: false
			};
			if (isBlob$1(data)) if (this._state !== DEFAULT) this.enqueue([
				this.getBlobData,
				data,
				false,
				options,
				cb
			]);
			else this.getBlobData(data, false, options, cb);
			else if (this._state !== DEFAULT) this.enqueue([
				this.dispatch,
				data,
				false,
				options,
				cb
			]);
			else this.sendFrame(Sender$1.frame(data, options), cb);
		}
		/**
		* Sends a data message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Object} options Options object
		* @param {Boolean} [options.binary=false] Specifies whether `data` is binary
		*     or text
		* @param {Boolean} [options.compress=false] Specifies whether or not to
		*     compress `data`
		* @param {Boolean} [options.fin=false] Specifies whether the fragment is the
		*     last one
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		send(data, options, cb) {
			const perMessageDeflate = this._extensions[PerMessageDeflate$2.extensionName];
			let opcode = options.binary ? 2 : 1;
			let rsv1 = options.compress;
			let byteLength;
			let readOnly;
			if (typeof data === "string") {
				byteLength = Buffer.byteLength(data);
				readOnly = false;
			} else if (isBlob$1(data)) {
				byteLength = data.size;
				readOnly = false;
			} else {
				data = toBuffer$1(data);
				byteLength = data.length;
				readOnly = toBuffer$1.readOnly;
			}
			if (this._firstFragment) {
				this._firstFragment = false;
				if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) rsv1 = byteLength >= perMessageDeflate._threshold;
				this._compress = rsv1;
			} else {
				rsv1 = false;
				opcode = 0;
			}
			if (options.fin) this._firstFragment = true;
			const opts = {
				[kByteLength]: byteLength,
				fin: options.fin,
				generateMask: this._generateMask,
				mask: options.mask,
				maskBuffer: this._maskBuffer,
				opcode,
				readOnly,
				rsv1
			};
			if (isBlob$1(data)) if (this._state !== DEFAULT) this.enqueue([
				this.getBlobData,
				data,
				this._compress,
				opts,
				cb
			]);
			else this.getBlobData(data, this._compress, opts, cb);
			else if (this._state !== DEFAULT) this.enqueue([
				this.dispatch,
				data,
				this._compress,
				opts,
				cb
			]);
			else this.dispatch(data, this._compress, opts, cb);
		}
		/**
		* Gets the contents of a blob as binary data.
		*
		* @param {Blob} blob The blob
		* @param {Boolean} [compress=false] Specifies whether or not to compress
		*     the data
		* @param {Object} options Options object
		* @param {Boolean} [options.fin=false] Specifies whether or not to set the
		*     FIN bit
		* @param {Function} [options.generateMask] The function used to generate the
		*     masking key
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Buffer} [options.maskBuffer] The buffer used to store the masking
		*     key
		* @param {Number} options.opcode The opcode
		* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
		*     modified
		* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
		*     RSV1 bit
		* @param {Function} [cb] Callback
		* @private
		*/
		getBlobData(blob, compress, options, cb) {
			this._bufferedBytes += options[kByteLength];
			this._state = GET_BLOB_DATA;
			blob.arrayBuffer().then((arrayBuffer) => {
				if (this._socket.destroyed) {
					const err = new Error("The socket was closed while the blob was being read");
					process.nextTick(callCallbacks, this, err, cb);
					return;
				}
				this._bufferedBytes -= options[kByteLength];
				const data = toBuffer$1(arrayBuffer);
				if (!compress) {
					this._state = DEFAULT;
					this.sendFrame(Sender$1.frame(data, options), cb);
					this.dequeue();
				} else this.dispatch(data, compress, options, cb);
			}).catch((err) => {
				process.nextTick(onError, this, err, cb);
			});
		}
		/**
		* Dispatches a message.
		*
		* @param {(Buffer|String)} data The message to send
		* @param {Boolean} [compress=false] Specifies whether or not to compress
		*     `data`
		* @param {Object} options Options object
		* @param {Boolean} [options.fin=false] Specifies whether or not to set the
		*     FIN bit
		* @param {Function} [options.generateMask] The function used to generate the
		*     masking key
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Buffer} [options.maskBuffer] The buffer used to store the masking
		*     key
		* @param {Number} options.opcode The opcode
		* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
		*     modified
		* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
		*     RSV1 bit
		* @param {Function} [cb] Callback
		* @private
		*/
		dispatch(data, compress, options, cb) {
			if (!compress) {
				this.sendFrame(Sender$1.frame(data, options), cb);
				return;
			}
			const perMessageDeflate = this._extensions[PerMessageDeflate$2.extensionName];
			this._bufferedBytes += options[kByteLength];
			this._state = DEFLATING;
			perMessageDeflate.compress(data, options.fin, (_, buf) => {
				if (this._socket.destroyed) {
					const err = new Error("The socket was closed while data was being compressed");
					callCallbacks(this, err, cb);
					return;
				}
				this._bufferedBytes -= options[kByteLength];
				this._state = DEFAULT;
				options.readOnly = false;
				this.sendFrame(Sender$1.frame(buf, options), cb);
				this.dequeue();
			});
		}
		/**
		* Executes queued send operations.
		*
		* @private
		*/
		dequeue() {
			while (this._state === DEFAULT && this._queue.length) {
				const params = this._queue.shift();
				this._bufferedBytes -= params[3][kByteLength];
				Reflect.apply(params[0], this, params.slice(1));
			}
		}
		/**
		* Enqueues a send operation.
		*
		* @param {Array} params Send operation parameters.
		* @private
		*/
		enqueue(params) {
			this._bufferedBytes += params[3][kByteLength];
			this._queue.push(params);
		}
		/**
		* Sends a frame.
		*
		* @param {(Buffer | String)[]} list The frame to send
		* @param {Function} [cb] Callback
		* @private
		*/
		sendFrame(list, cb) {
			if (list.length === 2) {
				this._socket.cork();
				this._socket.write(list[0]);
				this._socket.write(list[1], cb);
				this._socket.uncork();
			} else this._socket.write(list[0], cb);
		}
	};
	module.exports = Sender$1;
	/**
	* Calls queued callbacks with an error.
	*
	* @param {Sender} sender The `Sender` instance
	* @param {Error} err The error to call the callbacks with
	* @param {Function} [cb] The first callback
	* @private
	*/
	function callCallbacks(sender, err, cb) {
		if (typeof cb === "function") cb(err);
		for (let i = 0; i < sender._queue.length; i++) {
			const params = sender._queue[i];
			const callback = params[params.length - 1];
			if (typeof callback === "function") callback(err);
		}
	}
	/**
	* Handles a `Sender` error.
	*
	* @param {Sender} sender The `Sender` instance
	* @param {Error} err The error
	* @param {Function} [cb] The first pending callback
	* @private
	*/
	function onError(sender, err, cb) {
		callCallbacks(sender, err, cb);
		sender.onerror(err);
	}
} });

//#endregion
//#region node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({ "node_modules/ws/lib/event-target.js"(exports, module) {
	const { kForOnEventAttribute: kForOnEventAttribute$1, kListener: kListener$1 } = require_constants();
	const kCode = Symbol("kCode");
	const kData = Symbol("kData");
	const kError = Symbol("kError");
	const kMessage = Symbol("kMessage");
	const kReason = Symbol("kReason");
	const kTarget = Symbol("kTarget");
	const kType = Symbol("kType");
	const kWasClean = Symbol("kWasClean");
	/**
	* Class representing an event.
	*/
	var Event = class {
		/**
		* Create a new `Event`.
		*
		* @param {String} type The name of the event
		* @throws {TypeError} If the `type` argument is not specified
		*/
		constructor(type) {
			this[kTarget] = null;
			this[kType] = type;
		}
		/**
		* @type {*}
		*/
		get target() {
			return this[kTarget];
		}
		/**
		* @type {String}
		*/
		get type() {
			return this[kType];
		}
	};
	Object.defineProperty(Event.prototype, "target", { enumerable: true });
	Object.defineProperty(Event.prototype, "type", { enumerable: true });
	/**
	* Class representing a close event.
	*
	* @extends Event
	*/
	var CloseEvent = class extends Event {
		/**
		* Create a new `CloseEvent`.
		*
		* @param {String} type The name of the event
		* @param {Object} [options] A dictionary object that allows for setting
		*     attributes via object members of the same name
		* @param {Number} [options.code=0] The status code explaining why the
		*     connection was closed
		* @param {String} [options.reason=''] A human-readable string explaining why
		*     the connection was closed
		* @param {Boolean} [options.wasClean=false] Indicates whether or not the
		*     connection was cleanly closed
		*/
		constructor(type, options = {}) {
			super(type);
			this[kCode] = options.code === void 0 ? 0 : options.code;
			this[kReason] = options.reason === void 0 ? "" : options.reason;
			this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
		}
		/**
		* @type {Number}
		*/
		get code() {
			return this[kCode];
		}
		/**
		* @type {String}
		*/
		get reason() {
			return this[kReason];
		}
		/**
		* @type {Boolean}
		*/
		get wasClean() {
			return this[kWasClean];
		}
	};
	Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
	Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
	Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
	/**
	* Class representing an error event.
	*
	* @extends Event
	*/
	var ErrorEvent = class extends Event {
		/**
		* Create a new `ErrorEvent`.
		*
		* @param {String} type The name of the event
		* @param {Object} [options] A dictionary object that allows for setting
		*     attributes via object members of the same name
		* @param {*} [options.error=null] The error that generated this event
		* @param {String} [options.message=''] The error message
		*/
		constructor(type, options = {}) {
			super(type);
			this[kError] = options.error === void 0 ? null : options.error;
			this[kMessage] = options.message === void 0 ? "" : options.message;
		}
		/**
		* @type {*}
		*/
		get error() {
			return this[kError];
		}
		/**
		* @type {String}
		*/
		get message() {
			return this[kMessage];
		}
	};
	Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
	Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
	/**
	* Class representing a message event.
	*
	* @extends Event
	*/
	var MessageEvent = class extends Event {
		/**
		* Create a new `MessageEvent`.
		*
		* @param {String} type The name of the event
		* @param {Object} [options] A dictionary object that allows for setting
		*     attributes via object members of the same name
		* @param {*} [options.data=null] The message content
		*/
		constructor(type, options = {}) {
			super(type);
			this[kData] = options.data === void 0 ? null : options.data;
		}
		/**
		* @type {*}
		*/
		get data() {
			return this[kData];
		}
	};
	Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
	/**
	* This provides methods for emulating the `EventTarget` interface. It's not
	* meant to be used directly.
	*
	* @mixin
	*/
	const EventTarget = {
		addEventListener(type, handler, options = {}) {
			for (const listener of this.listeners(type)) if (!options[kForOnEventAttribute$1] && listener[kListener$1] === handler && !listener[kForOnEventAttribute$1]) return;
			let wrapper;
			if (type === "message") wrapper = function onMessage(data, isBinary) {
				const event = new MessageEvent("message", { data: isBinary ? data : data.toString() });
				event[kTarget] = this;
				callListener(handler, this, event);
			};
			else if (type === "close") wrapper = function onClose(code, message) {
				const event = new CloseEvent("close", {
					code,
					reason: message.toString(),
					wasClean: this._closeFrameReceived && this._closeFrameSent
				});
				event[kTarget] = this;
				callListener(handler, this, event);
			};
			else if (type === "error") wrapper = function onError$1(error) {
				const event = new ErrorEvent("error", {
					error,
					message: error.message
				});
				event[kTarget] = this;
				callListener(handler, this, event);
			};
			else if (type === "open") wrapper = function onOpen() {
				const event = new Event("open");
				event[kTarget] = this;
				callListener(handler, this, event);
			};
			else return;
			wrapper[kForOnEventAttribute$1] = !!options[kForOnEventAttribute$1];
			wrapper[kListener$1] = handler;
			if (options.once) this.once(type, wrapper);
			else this.on(type, wrapper);
		},
		removeEventListener(type, handler) {
			for (const listener of this.listeners(type)) if (listener[kListener$1] === handler && !listener[kForOnEventAttribute$1]) {
				this.removeListener(type, listener);
				break;
			}
		}
	};
	module.exports = {
		CloseEvent,
		ErrorEvent,
		Event,
		EventTarget,
		MessageEvent
	};
	/**
	* Call an event listener
	*
	* @param {(Function|Object)} listener The listener to call
	* @param {*} thisArg The value to use as `this`` when calling the listener
	* @param {Event} event The event to pass to the listener
	* @private
	*/
	function callListener(listener, thisArg, event) {
		if (typeof listener === "object" && listener.handleEvent) listener.handleEvent.call(listener, event);
		else listener.call(thisArg, event);
	}
} });

//#endregion
//#region node_modules/ws/lib/extension.js
var require_extension = __commonJS({ "node_modules/ws/lib/extension.js"(exports, module) {
	const { tokenChars: tokenChars$1 } = require_validation();
	/**
	* Adds an offer to the map of extension offers or a parameter to the map of
	* parameters.
	*
	* @param {Object} dest The map of extension offers or parameters
	* @param {String} name The extension or parameter name
	* @param {(Object|Boolean|String)} elem The extension parameters or the
	*     parameter value
	* @private
	*/
	function push(dest, name, elem) {
		if (dest[name] === void 0) dest[name] = [elem];
		else dest[name].push(elem);
	}
	/**
	* Parses the `Sec-WebSocket-Extensions` header into an object.
	*
	* @param {String} header The field value of the header
	* @return {Object} The parsed object
	* @public
	*/
	function parse$2(header) {
		const offers = Object.create(null);
		let params = Object.create(null);
		let mustUnescape = false;
		let isEscaping = false;
		let inQuotes = false;
		let extensionName;
		let paramName;
		let start = -1;
		let code = -1;
		let end = -1;
		let i = 0;
		for (; i < header.length; i++) {
			code = header.charCodeAt(i);
			if (extensionName === void 0) if (end === -1 && tokenChars$1[code] === 1) {
				if (start === -1) start = i;
			} else if (i !== 0 && (code === 32 || code === 9)) {
				if (end === -1 && start !== -1) end = i;
			} else if (code === 59 || code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				const name = header.slice(start, end);
				if (code === 44) {
					push(offers, name, params);
					params = Object.create(null);
				} else extensionName = name;
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
			else if (paramName === void 0) if (end === -1 && tokenChars$1[code] === 1) {
				if (start === -1) start = i;
			} else if (code === 32 || code === 9) {
				if (end === -1 && start !== -1) end = i;
			} else if (code === 59 || code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				push(params, header.slice(start, end), true);
				if (code === 44) {
					push(offers, extensionName, params);
					params = Object.create(null);
					extensionName = void 0;
				}
				start = end = -1;
			} else if (code === 61 && start !== -1 && end === -1) {
				paramName = header.slice(start, i);
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
			else if (isEscaping) {
				if (tokenChars$1[code] !== 1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (start === -1) start = i;
				else if (!mustUnescape) mustUnescape = true;
				isEscaping = false;
			} else if (inQuotes) if (tokenChars$1[code] === 1) {
				if (start === -1) start = i;
			} else if (code === 34 && start !== -1) {
				inQuotes = false;
				end = i;
			} else if (code === 92) isEscaping = true;
			else throw new SyntaxError(`Unexpected character at index ${i}`);
			else if (code === 34 && header.charCodeAt(i - 1) === 61) inQuotes = true;
			else if (end === -1 && tokenChars$1[code] === 1) {
				if (start === -1) start = i;
			} else if (start !== -1 && (code === 32 || code === 9)) {
				if (end === -1) end = i;
			} else if (code === 59 || code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				let value = header.slice(start, end);
				if (mustUnescape) {
					value = value.replace(/\\/g, "");
					mustUnescape = false;
				}
				push(params, paramName, value);
				if (code === 44) {
					push(offers, extensionName, params);
					params = Object.create(null);
					extensionName = void 0;
				}
				paramName = void 0;
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
		}
		if (start === -1 || inQuotes || code === 32 || code === 9) throw new SyntaxError("Unexpected end of input");
		if (end === -1) end = i;
		const token = header.slice(start, end);
		if (extensionName === void 0) push(offers, token, params);
		else {
			if (paramName === void 0) push(params, token, true);
			else if (mustUnescape) push(params, paramName, token.replace(/\\/g, ""));
			else push(params, paramName, token);
			push(offers, extensionName, params);
		}
		return offers;
	}
	/**
	* Builds the `Sec-WebSocket-Extensions` header field value.
	*
	* @param {Object} extensions The map of extensions and parameters to format
	* @return {String} A string representing the given object
	* @public
	*/
	function format$1(extensions) {
		return Object.keys(extensions).map((extension$1) => {
			let configurations = extensions[extension$1];
			if (!Array.isArray(configurations)) configurations = [configurations];
			return configurations.map((params) => {
				return [extension$1].concat(Object.keys(params).map((k) => {
					let values = params[k];
					if (!Array.isArray(values)) values = [values];
					return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
				})).join("; ");
			}).join(", ");
		}).join(", ");
	}
	module.exports = {
		format: format$1,
		parse: parse$2
	};
} });

//#endregion
//#region node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({ "node_modules/ws/lib/websocket.js"(exports, module) {
	const EventEmitter$1 = __require("events");
	const https = __require("https");
	const http$2 = __require("http");
	const net = __require("net");
	const tls = __require("tls");
	const { randomBytes, createHash: createHash$1 } = __require("crypto");
	const { Duplex: Duplex$2, Readable } = __require("stream");
	const { URL: URL$1 } = __require("url");
	const PerMessageDeflate$1 = require_permessage_deflate();
	const Receiver = require_receiver();
	const Sender = require_sender();
	const { isBlob } = require_validation();
	const { BINARY_TYPES, CLOSE_TIMEOUT: CLOSE_TIMEOUT$1, EMPTY_BUFFER, GUID: GUID$1, kForOnEventAttribute, kListener, kStatusCode, kWebSocket: kWebSocket$1, NOOP } = require_constants();
	const { EventTarget: { addEventListener, removeEventListener } } = require_event_target();
	const { format, parse: parse$1 } = require_extension();
	const { toBuffer } = require_buffer_util();
	const kAborted = Symbol("kAborted");
	const protocolVersions = [8, 13];
	const readyStates = [
		"CONNECTING",
		"OPEN",
		"CLOSING",
		"CLOSED"
	];
	const subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
	/**
	* Class representing a WebSocket.
	*
	* @extends EventEmitter
	*/
	var WebSocket$2 = class WebSocket$2 extends EventEmitter$1 {
		/**
		* Create a new `WebSocket`.
		*
		* @param {(String|URL)} address The URL to which to connect
		* @param {(String|String[])} [protocols] The subprotocols
		* @param {Object} [options] Connection options
		*/
		constructor(address, protocols, options) {
			super();
			this._binaryType = BINARY_TYPES[0];
			this._closeCode = 1006;
			this._closeFrameReceived = false;
			this._closeFrameSent = false;
			this._closeMessage = EMPTY_BUFFER;
			this._closeTimer = null;
			this._errorEmitted = false;
			this._extensions = {};
			this._paused = false;
			this._protocol = "";
			this._readyState = WebSocket$2.CONNECTING;
			this._receiver = null;
			this._sender = null;
			this._socket = null;
			if (address !== null) {
				this._bufferedAmount = 0;
				this._isServer = false;
				this._redirects = 0;
				if (protocols === void 0) protocols = [];
				else if (!Array.isArray(protocols)) if (typeof protocols === "object" && protocols !== null) {
					options = protocols;
					protocols = [];
				} else protocols = [protocols];
				initAsClient(this, address, protocols, options);
			} else {
				this._autoPong = options.autoPong;
				this._closeTimeout = options.closeTimeout;
				this._isServer = true;
			}
		}
		/**
		* For historical reasons, the custom "nodebuffer" type is used by the default
		* instead of "blob".
		*
		* @type {String}
		*/
		get binaryType() {
			return this._binaryType;
		}
		set binaryType(type) {
			if (!BINARY_TYPES.includes(type)) return;
			this._binaryType = type;
			if (this._receiver) this._receiver._binaryType = type;
		}
		/**
		* @type {Number}
		*/
		get bufferedAmount() {
			if (!this._socket) return this._bufferedAmount;
			return this._socket._writableState.length + this._sender._bufferedBytes;
		}
		/**
		* @type {String}
		*/
		get extensions() {
			return Object.keys(this._extensions).join();
		}
		/**
		* @type {Boolean}
		*/
		get isPaused() {
			return this._paused;
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onclose() {
			return null;
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onerror() {
			return null;
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onopen() {
			return null;
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onmessage() {
			return null;
		}
		/**
		* @type {String}
		*/
		get protocol() {
			return this._protocol;
		}
		/**
		* @type {Number}
		*/
		get readyState() {
			return this._readyState;
		}
		/**
		* @type {String}
		*/
		get url() {
			return this._url;
		}
		/**
		* Set up the socket and the internal resources.
		*
		* @param {Duplex} socket The network socket between the server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Object} options Options object
		* @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
		*     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
		*     multiple times in the same tick
		* @param {Function} [options.generateMask] The function used to generate the
		*     masking key
		* @param {Number} [options.maxBufferedChunks=0] The maximum number of
		*     buffered data chunks
		* @param {Number} [options.maxFragments=0] The maximum number of message
		*     fragments
		* @param {Number} [options.maxPayload=0] The maximum allowed message size
		* @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
		*     not to skip UTF-8 validation for text and close messages
		* @private
		*/
		setSocket(socket, head, options) {
			const receiver = new Receiver({
				allowSynchronousEvents: options.allowSynchronousEvents,
				binaryType: this.binaryType,
				extensions: this._extensions,
				isServer: this._isServer,
				maxBufferedChunks: options.maxBufferedChunks,
				maxFragments: options.maxFragments,
				maxPayload: options.maxPayload,
				skipUTF8Validation: options.skipUTF8Validation
			});
			const sender = new Sender(socket, this._extensions, options.generateMask);
			this._receiver = receiver;
			this._sender = sender;
			this._socket = socket;
			receiver[kWebSocket$1] = this;
			sender[kWebSocket$1] = this;
			socket[kWebSocket$1] = this;
			receiver.on("conclude", receiverOnConclude);
			receiver.on("drain", receiverOnDrain);
			receiver.on("error", receiverOnError);
			receiver.on("message", receiverOnMessage);
			receiver.on("ping", receiverOnPing);
			receiver.on("pong", receiverOnPong);
			sender.onerror = senderOnError;
			if (socket.setTimeout) socket.setTimeout(0);
			if (socket.setNoDelay) socket.setNoDelay();
			if (head.length > 0) socket.unshift(head);
			socket.on("close", socketOnClose);
			socket.on("data", socketOnData);
			socket.on("end", socketOnEnd);
			socket.on("error", socketOnError$1);
			this._readyState = WebSocket$2.OPEN;
			this.emit("open");
		}
		/**
		* Emit the `'close'` event.
		*
		* @private
		*/
		emitClose() {
			if (!this._socket) {
				this._readyState = WebSocket$2.CLOSED;
				this.emit("close", this._closeCode, this._closeMessage);
				return;
			}
			if (this._extensions[PerMessageDeflate$1.extensionName]) this._extensions[PerMessageDeflate$1.extensionName].cleanup();
			this._receiver.removeAllListeners();
			this._readyState = WebSocket$2.CLOSED;
			this.emit("close", this._closeCode, this._closeMessage);
		}
		/**
		* Start a closing handshake.
		*
		*          +----------+   +-----------+   +----------+
		*     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
		*    |     +----------+   +-----------+   +----------+     |
		*          +----------+   +-----------+         |
		* CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
		*          +----------+   +-----------+   |
		*    |           |                        |   +---+        |
		*                +------------------------+-->|fin| - - - -
		*    |         +---+                      |   +---+
		*     - - - - -|fin|<---------------------+
		*              +---+
		*
		* @param {Number} [code] Status code explaining why the connection is closing
		* @param {(String|Buffer)} [data] The reason why the connection is
		*     closing
		* @public
		*/
		close(code, data) {
			if (this.readyState === WebSocket$2.CLOSED) return;
			if (this.readyState === WebSocket$2.CONNECTING) {
				const msg = "WebSocket was closed before the connection was established";
				abortHandshake$1(this, this._req, msg);
				return;
			}
			if (this.readyState === WebSocket$2.CLOSING) {
				if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) this._socket.end();
				return;
			}
			this._readyState = WebSocket$2.CLOSING;
			this._sender.close(code, data, !this._isServer, (err) => {
				if (err) return;
				this._closeFrameSent = true;
				if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) this._socket.end();
			});
			setCloseTimer(this);
		}
		/**
		* Pause the socket.
		*
		* @public
		*/
		pause() {
			if (this.readyState === WebSocket$2.CONNECTING || this.readyState === WebSocket$2.CLOSED) return;
			this._paused = true;
			this._socket.pause();
		}
		/**
		* Send a ping.
		*
		* @param {*} [data] The data to send
		* @param {Boolean} [mask] Indicates whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when the ping is sent
		* @public
		*/
		ping(data, mask, cb) {
			if (this.readyState === WebSocket$2.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof data === "function") {
				cb = data;
				data = mask = void 0;
			} else if (typeof mask === "function") {
				cb = mask;
				mask = void 0;
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket$2.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			if (mask === void 0) mask = !this._isServer;
			this._sender.ping(data || EMPTY_BUFFER, mask, cb);
		}
		/**
		* Send a pong.
		*
		* @param {*} [data] The data to send
		* @param {Boolean} [mask] Indicates whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when the pong is sent
		* @public
		*/
		pong(data, mask, cb) {
			if (this.readyState === WebSocket$2.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof data === "function") {
				cb = data;
				data = mask = void 0;
			} else if (typeof mask === "function") {
				cb = mask;
				mask = void 0;
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket$2.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			if (mask === void 0) mask = !this._isServer;
			this._sender.pong(data || EMPTY_BUFFER, mask, cb);
		}
		/**
		* Resume the socket.
		*
		* @public
		*/
		resume() {
			if (this.readyState === WebSocket$2.CONNECTING || this.readyState === WebSocket$2.CLOSED) return;
			this._paused = false;
			if (!this._receiver._writableState.needDrain) this._socket.resume();
		}
		/**
		* Send a data message.
		*
		* @param {*} data The message to send
		* @param {Object} [options] Options object
		* @param {Boolean} [options.binary] Specifies whether `data` is binary or
		*     text
		* @param {Boolean} [options.compress] Specifies whether or not to compress
		*     `data`
		* @param {Boolean} [options.fin=true] Specifies whether the fragment is the
		*     last one
		* @param {Boolean} [options.mask] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when data is written out
		* @public
		*/
		send(data, options, cb) {
			if (this.readyState === WebSocket$2.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof options === "function") {
				cb = options;
				options = {};
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket$2.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			const opts = {
				binary: typeof data !== "string",
				mask: !this._isServer,
				compress: true,
				fin: true,
				...options
			};
			if (!this._extensions[PerMessageDeflate$1.extensionName]) opts.compress = false;
			this._sender.send(data || EMPTY_BUFFER, opts, cb);
		}
		/**
		* Forcibly close the connection.
		*
		* @public
		*/
		terminate() {
			if (this.readyState === WebSocket$2.CLOSED) return;
			if (this.readyState === WebSocket$2.CONNECTING) {
				const msg = "WebSocket was closed before the connection was established";
				abortHandshake$1(this, this._req, msg);
				return;
			}
			if (this._socket) {
				this._readyState = WebSocket$2.CLOSING;
				this._socket.destroy();
			}
		}
	};
	/**
	* @constant {Number} CONNECTING
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket$2, "CONNECTING", {
		enumerable: true,
		value: readyStates.indexOf("CONNECTING")
	});
	/**
	* @constant {Number} CONNECTING
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket$2.prototype, "CONNECTING", {
		enumerable: true,
		value: readyStates.indexOf("CONNECTING")
	});
	/**
	* @constant {Number} OPEN
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket$2, "OPEN", {
		enumerable: true,
		value: readyStates.indexOf("OPEN")
	});
	/**
	* @constant {Number} OPEN
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket$2.prototype, "OPEN", {
		enumerable: true,
		value: readyStates.indexOf("OPEN")
	});
	/**
	* @constant {Number} CLOSING
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket$2, "CLOSING", {
		enumerable: true,
		value: readyStates.indexOf("CLOSING")
	});
	/**
	* @constant {Number} CLOSING
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket$2.prototype, "CLOSING", {
		enumerable: true,
		value: readyStates.indexOf("CLOSING")
	});
	/**
	* @constant {Number} CLOSED
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket$2, "CLOSED", {
		enumerable: true,
		value: readyStates.indexOf("CLOSED")
	});
	/**
	* @constant {Number} CLOSED
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket$2.prototype, "CLOSED", {
		enumerable: true,
		value: readyStates.indexOf("CLOSED")
	});
	[
		"binaryType",
		"bufferedAmount",
		"extensions",
		"isPaused",
		"protocol",
		"readyState",
		"url"
	].forEach((property) => {
		Object.defineProperty(WebSocket$2.prototype, property, { enumerable: true });
	});
	[
		"open",
		"error",
		"close",
		"message"
	].forEach((method) => {
		Object.defineProperty(WebSocket$2.prototype, `on${method}`, {
			enumerable: true,
			get() {
				for (const listener of this.listeners(method)) if (listener[kForOnEventAttribute]) return listener[kListener];
				return null;
			},
			set(handler) {
				for (const listener of this.listeners(method)) if (listener[kForOnEventAttribute]) {
					this.removeListener(method, listener);
					break;
				}
				if (typeof handler !== "function") return;
				this.addEventListener(method, handler, { [kForOnEventAttribute]: true });
			}
		});
	});
	WebSocket$2.prototype.addEventListener = addEventListener;
	WebSocket$2.prototype.removeEventListener = removeEventListener;
	module.exports = WebSocket$2;
	/**
	* Initialize a WebSocket client.
	*
	* @param {WebSocket} websocket The client to initialize
	* @param {(String|URL)} address The URL to which to connect
	* @param {Array} protocols The subprotocols
	* @param {Object} [options] Connection options
	* @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether any
	*     of the `'message'`, `'ping'`, and `'pong'` events can be emitted multiple
	*     times in the same tick
	* @param {Boolean} [options.autoPong=true] Specifies whether or not to
	*     automatically send a pong in response to a ping
	* @param {Number} [options.closeTimeout=30000] Duration in milliseconds to wait
	*     for the closing handshake to finish after `websocket.close()` is called
	* @param {Function} [options.finishRequest] A function which can be used to
	*     customize the headers of each http request before it is sent
	* @param {Boolean} [options.followRedirects=false] Whether or not to follow
	*     redirects
	* @param {Function} [options.generateMask] The function used to generate the
	*     masking key
	* @param {Number} [options.handshakeTimeout] Timeout in milliseconds for the
	*     handshake request
	* @param {Number} [options.maxBufferedChunks=262144] The maximum number of
	*     buffered data chunks
	* @param {Number} [options.maxFragments=16384] The maximum number of message
	*     fragments
	* @param {Number} [options.maxPayload=104857600] The maximum allowed message
	*     size
	* @param {Number} [options.maxRedirects=10] The maximum number of redirects
	*     allowed
	* @param {String} [options.origin] Value of the `Origin` or
	*     `Sec-WebSocket-Origin` header
	* @param {(Boolean|Object)} [options.perMessageDeflate=true] Enable/disable
	*     permessage-deflate
	* @param {Number} [options.protocolVersion=13] Value of the
	*     `Sec-WebSocket-Version` header
	* @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	*     not to skip UTF-8 validation for text and close messages
	* @private
	*/
	function initAsClient(websocket, address, protocols, options) {
		const opts = {
			allowSynchronousEvents: true,
			autoPong: true,
			closeTimeout: CLOSE_TIMEOUT$1,
			protocolVersion: protocolVersions[1],
			maxBufferedChunks: 256 * 1024,
			maxFragments: 16 * 1024,
			maxPayload: 100 * 1024 * 1024,
			skipUTF8Validation: false,
			perMessageDeflate: true,
			followRedirects: false,
			maxRedirects: 10,
			...options,
			socketPath: void 0,
			hostname: void 0,
			protocol: void 0,
			timeout: void 0,
			method: "GET",
			host: void 0,
			path: void 0,
			port: void 0
		};
		websocket._autoPong = opts.autoPong;
		websocket._closeTimeout = opts.closeTimeout;
		if (!protocolVersions.includes(opts.protocolVersion)) throw new RangeError(`Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`);
		let parsedUrl;
		if (address instanceof URL$1) parsedUrl = address;
		else try {
			parsedUrl = new URL$1(address);
		} catch {
			throw new SyntaxError(`Invalid URL: ${address}`);
		}
		if (parsedUrl.protocol === "http:") parsedUrl.protocol = "ws:";
		else if (parsedUrl.protocol === "https:") parsedUrl.protocol = "wss:";
		websocket._url = parsedUrl.href;
		const isSecure = parsedUrl.protocol === "wss:";
		const isIpcUrl = parsedUrl.protocol === "ws+unix:";
		let invalidUrlMessage;
		if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) invalidUrlMessage = "The URL's protocol must be one of \"ws:\", \"wss:\", \"http:\", \"https:\", or \"ws+unix:\"";
		else if (isIpcUrl && !parsedUrl.pathname) invalidUrlMessage = "The URL's pathname is empty";
		else if (parsedUrl.hash) invalidUrlMessage = "The URL contains a fragment identifier";
		if (invalidUrlMessage) {
			const err = new SyntaxError(invalidUrlMessage);
			if (websocket._redirects === 0) throw err;
			else {
				emitErrorAndClose(websocket, err);
				return;
			}
		}
		const defaultPort = isSecure ? 443 : 80;
		const key = randomBytes(16).toString("base64");
		const request = isSecure ? https.request : http$2.request;
		const protocolSet = new Set();
		let perMessageDeflate;
		opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
		opts.defaultPort = opts.defaultPort || defaultPort;
		opts.port = parsedUrl.port || defaultPort;
		opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
		opts.headers = {
			...opts.headers,
			"Sec-WebSocket-Version": opts.protocolVersion,
			"Sec-WebSocket-Key": key,
			Connection: "Upgrade",
			Upgrade: "websocket"
		};
		opts.path = parsedUrl.pathname + parsedUrl.search;
		opts.timeout = opts.handshakeTimeout;
		if (opts.perMessageDeflate) {
			perMessageDeflate = new PerMessageDeflate$1({
				...opts.perMessageDeflate,
				isServer: false,
				maxPayload: opts.maxPayload
			});
			opts.headers["Sec-WebSocket-Extensions"] = format({ [PerMessageDeflate$1.extensionName]: perMessageDeflate.offer() });
		}
		if (protocols.length) {
			for (const protocol of protocols) {
				if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) throw new SyntaxError("An invalid or duplicated subprotocol was specified");
				protocolSet.add(protocol);
			}
			opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
		}
		if (opts.origin) if (opts.protocolVersion < 13) opts.headers["Sec-WebSocket-Origin"] = opts.origin;
		else opts.headers.Origin = opts.origin;
		if (parsedUrl.username || parsedUrl.password) opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
		if (isIpcUrl) {
			const parts = opts.path.split(":");
			opts.socketPath = parts[0];
			opts.path = parts[1];
		}
		let req;
		if (opts.followRedirects) {
			if (websocket._redirects === 0) {
				websocket._originalIpc = isIpcUrl;
				websocket._originalSecure = isSecure;
				websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
				const headers = options && options.headers;
				options = {
					...options,
					headers: {}
				};
				if (headers) for (const [key$1, value] of Object.entries(headers)) options.headers[key$1.toLowerCase()] = value;
			} else if (websocket.listenerCount("redirect") === 0) {
				const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
				if (!isSameHost || websocket._originalSecure && !isSecure) {
					delete opts.headers.authorization;
					delete opts.headers.cookie;
					if (!isSameHost) delete opts.headers.host;
					opts.auth = void 0;
				}
			}
			if (opts.auth && !options.headers.authorization) options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
			req = websocket._req = request(opts);
			if (websocket._redirects) websocket.emit("redirect", websocket.url, req);
		} else req = websocket._req = request(opts);
		if (opts.timeout) req.on("timeout", () => {
			abortHandshake$1(websocket, req, "Opening handshake has timed out");
		});
		req.on("error", (err) => {
			if (req === null || req[kAborted]) return;
			req = websocket._req = null;
			emitErrorAndClose(websocket, err);
		});
		req.on("response", (res) => {
			const location = res.headers.location;
			const statusCode = res.statusCode;
			if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
				if (++websocket._redirects > opts.maxRedirects) {
					abortHandshake$1(websocket, req, "Maximum redirects exceeded");
					return;
				}
				req.abort();
				let addr;
				try {
					addr = new URL$1(location, address);
				} catch (e) {
					const err = new SyntaxError(`Invalid URL: ${location}`);
					emitErrorAndClose(websocket, err);
					return;
				}
				initAsClient(websocket, addr, protocols, options);
			} else if (!websocket.emit("unexpected-response", req, res)) abortHandshake$1(websocket, req, `Unexpected server response: ${res.statusCode}`);
		});
		req.on("upgrade", (res, socket, head) => {
			websocket.emit("upgrade", res);
			if (websocket.readyState !== WebSocket$2.CONNECTING) return;
			req = websocket._req = null;
			const upgrade = res.headers.upgrade;
			if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
				abortHandshake$1(websocket, socket, "Invalid Upgrade header");
				return;
			}
			const digest = createHash$1("sha1").update(key + GUID$1).digest("base64");
			if (res.headers["sec-websocket-accept"] !== digest) {
				abortHandshake$1(websocket, socket, "Invalid Sec-WebSocket-Accept header");
				return;
			}
			const serverProt = res.headers["sec-websocket-protocol"];
			let protError;
			if (serverProt !== void 0) {
				if (!protocolSet.size) protError = "Server sent a subprotocol but none was requested";
				else if (!protocolSet.has(serverProt)) protError = "Server sent an invalid subprotocol";
			} else if (protocolSet.size) protError = "Server sent no subprotocol";
			if (protError) {
				abortHandshake$1(websocket, socket, protError);
				return;
			}
			if (serverProt) websocket._protocol = serverProt;
			const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
			if (secWebSocketExtensions !== void 0) {
				if (!perMessageDeflate) {
					const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
					abortHandshake$1(websocket, socket, message);
					return;
				}
				let extensions;
				try {
					extensions = parse$1(secWebSocketExtensions);
				} catch (err) {
					const message = "Invalid Sec-WebSocket-Extensions header";
					abortHandshake$1(websocket, socket, message);
					return;
				}
				const extensionNames = Object.keys(extensions);
				if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate$1.extensionName) {
					const message = "Server indicated an extension that was not requested";
					abortHandshake$1(websocket, socket, message);
					return;
				}
				try {
					perMessageDeflate.accept(extensions[PerMessageDeflate$1.extensionName]);
				} catch (err) {
					const message = "Invalid Sec-WebSocket-Extensions header";
					abortHandshake$1(websocket, socket, message);
					return;
				}
				websocket._extensions[PerMessageDeflate$1.extensionName] = perMessageDeflate;
			}
			websocket.setSocket(socket, head, {
				allowSynchronousEvents: opts.allowSynchronousEvents,
				generateMask: opts.generateMask,
				maxBufferedChunks: opts.maxBufferedChunks,
				maxFragments: opts.maxFragments,
				maxPayload: opts.maxPayload,
				skipUTF8Validation: opts.skipUTF8Validation
			});
		});
		if (opts.finishRequest) opts.finishRequest(req, websocket);
		else req.end();
	}
	/**
	* Emit the `'error'` and `'close'` events.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {Error} The error to emit
	* @private
	*/
	function emitErrorAndClose(websocket, err) {
		websocket._readyState = WebSocket$2.CLOSING;
		websocket._errorEmitted = true;
		websocket.emit("error", err);
		websocket.emitClose();
	}
	/**
	* Create a `net.Socket` and initiate a connection.
	*
	* @param {Object} options Connection options
	* @return {net.Socket} The newly created socket used to start the connection
	* @private
	*/
	function netConnect(options) {
		options.path = options.socketPath;
		return net.connect(options);
	}
	/**
	* Create a `tls.TLSSocket` and initiate a connection.
	*
	* @param {Object} options Connection options
	* @return {tls.TLSSocket} The newly created socket used to start the connection
	* @private
	*/
	function tlsConnect(options) {
		options.path = void 0;
		if (!options.servername && options.servername !== "") options.servername = net.isIP(options.host) ? "" : options.host;
		return tls.connect(options);
	}
	/**
	* Abort the handshake and emit an error.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {(http.ClientRequest|net.Socket|tls.Socket)} stream The request to
	*     abort or the socket to destroy
	* @param {String} message The error message
	* @private
	*/
	function abortHandshake$1(websocket, stream, message) {
		websocket._readyState = WebSocket$2.CLOSING;
		const err = new Error(message);
		Error.captureStackTrace(err, abortHandshake$1);
		if (stream.setHeader) {
			stream[kAborted] = true;
			stream.abort();
			if (stream.socket && !stream.socket.destroyed) stream.socket.destroy();
			process.nextTick(emitErrorAndClose, websocket, err);
		} else {
			stream.destroy(err);
			stream.once("error", websocket.emit.bind(websocket, "error"));
			stream.once("close", websocket.emitClose.bind(websocket));
		}
	}
	/**
	* Handle cases where the `ping()`, `pong()`, or `send()` methods are called
	* when the `readyState` attribute is `CLOSING` or `CLOSED`.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {*} [data] The data to send
	* @param {Function} [cb] Callback
	* @private
	*/
	function sendAfterClose(websocket, data, cb) {
		if (data) {
			const length = isBlob(data) ? data.size : toBuffer(data).length;
			if (websocket._socket) websocket._sender._bufferedBytes += length;
			else websocket._bufferedAmount += length;
		}
		if (cb) {
			const err = new Error(`WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`);
			process.nextTick(cb, err);
		}
	}
	/**
	* The listener of the `Receiver` `'conclude'` event.
	*
	* @param {Number} code The status code
	* @param {Buffer} reason The reason for closing
	* @private
	*/
	function receiverOnConclude(code, reason) {
		const websocket = this[kWebSocket$1];
		websocket._closeFrameReceived = true;
		websocket._closeMessage = reason;
		websocket._closeCode = code;
		if (websocket._socket[kWebSocket$1] === void 0) return;
		websocket._socket.removeListener("data", socketOnData);
		process.nextTick(resume, websocket._socket);
		if (code === 1005) websocket.close();
		else websocket.close(code, reason);
	}
	/**
	* The listener of the `Receiver` `'drain'` event.
	*
	* @private
	*/
	function receiverOnDrain() {
		const websocket = this[kWebSocket$1];
		if (!websocket.isPaused) websocket._socket.resume();
	}
	/**
	* The listener of the `Receiver` `'error'` event.
	*
	* @param {(RangeError|Error)} err The emitted error
	* @private
	*/
	function receiverOnError(err) {
		const websocket = this[kWebSocket$1];
		if (websocket._socket[kWebSocket$1] !== void 0) {
			websocket._socket.removeListener("data", socketOnData);
			process.nextTick(resume, websocket._socket);
			websocket.close(err[kStatusCode]);
		}
		if (!websocket._errorEmitted) {
			websocket._errorEmitted = true;
			websocket.emit("error", err);
		}
	}
	/**
	* The listener of the `Receiver` `'finish'` event.
	*
	* @private
	*/
	function receiverOnFinish() {
		this[kWebSocket$1].emitClose();
	}
	/**
	* The listener of the `Receiver` `'message'` event.
	*
	* @param {Buffer|ArrayBuffer|Buffer[])} data The message
	* @param {Boolean} isBinary Specifies whether the message is binary or not
	* @private
	*/
	function receiverOnMessage(data, isBinary) {
		this[kWebSocket$1].emit("message", data, isBinary);
	}
	/**
	* The listener of the `Receiver` `'ping'` event.
	*
	* @param {Buffer} data The data included in the ping frame
	* @private
	*/
	function receiverOnPing(data) {
		const websocket = this[kWebSocket$1];
		if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
		websocket.emit("ping", data);
	}
	/**
	* The listener of the `Receiver` `'pong'` event.
	*
	* @param {Buffer} data The data included in the pong frame
	* @private
	*/
	function receiverOnPong(data) {
		this[kWebSocket$1].emit("pong", data);
	}
	/**
	* Resume a readable stream
	*
	* @param {Readable} stream The readable stream
	* @private
	*/
	function resume(stream) {
		stream.resume();
	}
	/**
	* The `Sender` error event handler.
	*
	* @param {Error} The error
	* @private
	*/
	function senderOnError(err) {
		const websocket = this[kWebSocket$1];
		if (websocket.readyState === WebSocket$2.CLOSED) return;
		if (websocket.readyState === WebSocket$2.OPEN) {
			websocket._readyState = WebSocket$2.CLOSING;
			setCloseTimer(websocket);
		}
		this._socket.end();
		if (!websocket._errorEmitted) {
			websocket._errorEmitted = true;
			websocket.emit("error", err);
		}
	}
	/**
	* Set a timer to destroy the underlying raw socket of a WebSocket.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @private
	*/
	function setCloseTimer(websocket) {
		websocket._closeTimer = setTimeout(websocket._socket.destroy.bind(websocket._socket), websocket._closeTimeout);
	}
	/**
	* The listener of the socket `'close'` event.
	*
	* @private
	*/
	function socketOnClose() {
		const websocket = this[kWebSocket$1];
		this.removeListener("close", socketOnClose);
		this.removeListener("data", socketOnData);
		this.removeListener("end", socketOnEnd);
		websocket._readyState = WebSocket$2.CLOSING;
		if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
			const chunk = this.read(this._readableState.length);
			websocket._receiver.write(chunk);
		}
		websocket._receiver.end();
		this[kWebSocket$1] = void 0;
		clearTimeout(websocket._closeTimer);
		if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) websocket.emitClose();
		else {
			websocket._receiver.on("error", receiverOnFinish);
			websocket._receiver.on("finish", receiverOnFinish);
		}
	}
	/**
	* The listener of the socket `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function socketOnData(chunk) {
		if (!this[kWebSocket$1]._receiver.write(chunk)) this.pause();
	}
	/**
	* The listener of the socket `'end'` event.
	*
	* @private
	*/
	function socketOnEnd() {
		const websocket = this[kWebSocket$1];
		websocket._readyState = WebSocket$2.CLOSING;
		websocket._receiver.end();
		this.end();
	}
	/**
	* The listener of the socket `'error'` event.
	*
	* @private
	*/
	function socketOnError$1() {
		const websocket = this[kWebSocket$1];
		this.removeListener("error", socketOnError$1);
		this.on("error", NOOP);
		if (websocket) {
			websocket._readyState = WebSocket$2.CLOSING;
			this.destroy();
		}
	}
} });
var import_websocket = __toESM(require_websocket(), 1);

//#endregion
//#region node_modules/ws/lib/stream.js
var require_stream = __commonJS({ "node_modules/ws/lib/stream.js"(exports, module) {
	const WebSocket$1 = require_websocket();
	const { Duplex: Duplex$1 } = __require("stream");
	/**
	* Emits the `'close'` event on a stream.
	*
	* @param {Duplex} stream The stream.
	* @private
	*/
	function emitClose$1(stream) {
		stream.emit("close");
	}
	/**
	* The listener of the `'end'` event.
	*
	* @private
	*/
	function duplexOnEnd() {
		if (!this.destroyed && this._writableState.finished) this.destroy();
	}
	/**
	* The listener of the `'error'` event.
	*
	* @param {Error} err The error
	* @private
	*/
	function duplexOnError(err) {
		this.removeListener("error", duplexOnError);
		this.destroy();
		if (this.listenerCount("error") === 0) this.emit("error", err);
	}
	/**
	* Wraps a `WebSocket` in a duplex stream.
	*
	* @param {WebSocket} ws The `WebSocket` to wrap
	* @param {Object} [options] The options for the `Duplex` constructor
	* @return {Duplex} The duplex stream
	* @public
	*/
	function createWebSocketStream(ws, options) {
		let terminateOnDestroy = true;
		const duplex = new Duplex$1({
			...options,
			autoDestroy: false,
			emitClose: false,
			objectMode: false,
			writableObjectMode: false
		});
		ws.on("message", function message(msg, isBinary) {
			const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
			if (!duplex.push(data)) ws.pause();
		});
		ws.once("error", function error(err) {
			if (duplex.destroyed) return;
			terminateOnDestroy = false;
			duplex.destroy(err);
		});
		ws.once("close", function close() {
			if (duplex.destroyed) return;
			duplex.push(null);
		});
		duplex._destroy = function(err, callback) {
			if (ws.readyState === ws.CLOSED) {
				callback(err);
				process.nextTick(emitClose$1, duplex);
				return;
			}
			let called = false;
			ws.once("error", function error(err$1) {
				called = true;
				callback(err$1);
			});
			ws.once("close", function close() {
				if (!called) callback(err);
				process.nextTick(emitClose$1, duplex);
			});
			if (terminateOnDestroy) ws.terminate();
		};
		duplex._final = function(callback) {
			if (ws.readyState === ws.CONNECTING) {
				ws.once("open", function open() {
					duplex._final(callback);
				});
				return;
			}
			if (ws._socket === null) return;
			if (ws._socket._writableState.finished) {
				callback();
				if (duplex._readableState.endEmitted) duplex.destroy();
			} else {
				ws._socket.once("finish", function finish() {
					callback();
				});
				ws.close();
			}
		};
		duplex._read = function() {
			if (ws.isPaused) ws.resume();
		};
		duplex._write = function(chunk, encoding, callback) {
			if (ws.readyState === ws.CONNECTING) {
				ws.once("open", function open() {
					duplex._write(chunk, encoding, callback);
				});
				return;
			}
			ws.send(chunk, callback);
		};
		duplex.on("end", duplexOnEnd);
		duplex.on("error", duplexOnError);
		return duplex;
	}
	module.exports = createWebSocketStream;
} });

//#endregion
//#region node_modules/ws/lib/subprotocol.js
var require_subprotocol = __commonJS({ "node_modules/ws/lib/subprotocol.js"(exports, module) {
	const { tokenChars } = require_validation();
	/**
	* Parses the `Sec-WebSocket-Protocol` header into a set of subprotocol names.
	*
	* @param {String} header The field value of the header
	* @return {Set} The subprotocol names
	* @public
	*/
	function parse(header) {
		const protocols = new Set();
		let start = -1;
		let end = -1;
		let i = 0;
		for (; i < header.length; i++) {
			const code = header.charCodeAt(i);
			if (end === -1 && tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (i !== 0 && (code === 32 || code === 9)) {
				if (end === -1 && start !== -1) end = i;
			} else if (code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				const protocol$1 = header.slice(start, end);
				if (protocols.has(protocol$1)) throw new SyntaxError(`The "${protocol$1}" subprotocol is duplicated`);
				protocols.add(protocol$1);
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
		}
		if (start === -1 || end !== -1) throw new SyntaxError("Unexpected end of input");
		const protocol = header.slice(start, i);
		if (protocols.has(protocol)) throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
		protocols.add(protocol);
		return protocols;
	}
	module.exports = { parse };
} });

//#endregion
//#region node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({ "node_modules/ws/lib/websocket-server.js"(exports, module) {
	const EventEmitter = __require("events");
	const http$1 = __require("http");
	const { Duplex } = __require("stream");
	const { createHash } = __require("crypto");
	const extension = require_extension();
	const PerMessageDeflate = require_permessage_deflate();
	const subprotocol = require_subprotocol();
	const WebSocket = require_websocket();
	const { CLOSE_TIMEOUT, GUID, kWebSocket } = require_constants();
	const keyRegex = /^[+/0-9A-Za-z]{22}==$/;
	const RUNNING = 0;
	const CLOSING = 1;
	const CLOSED = 2;
	/**
	* Class representing a WebSocket server.
	*
	* @extends EventEmitter
	*/
	var WebSocketServer = class extends EventEmitter {
		/**
		* Create a `WebSocketServer` instance.
		*
		* @param {Object} options Configuration options
		* @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
		*     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
		*     multiple times in the same tick
		* @param {Boolean} [options.autoPong=true] Specifies whether or not to
		*     automatically send a pong in response to a ping
		* @param {Number} [options.backlog=511] The maximum length of the queue of
		*     pending connections
		* @param {Boolean} [options.clientTracking=true] Specifies whether or not to
		*     track clients
		* @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
		*     wait for the closing handshake to finish after `websocket.close()` is
		*     called
		* @param {Function} [options.handleProtocols] A hook to handle protocols
		* @param {String} [options.host] The hostname where to bind the server
		* @param {Number} [options.maxBufferedChunks=262144] The maximum number of
		*     buffered data chunks
		* @param {Number} [options.maxFragments=16384] The maximum number of message
		*     fragments
		* @param {Number} [options.maxPayload=104857600] The maximum allowed message
		*     size
		* @param {Boolean} [options.noServer=false] Enable no server mode
		* @param {String} [options.path] Accept only connections matching this path
		* @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
		*     permessage-deflate
		* @param {Number} [options.port] The port where to bind the server
		* @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
		*     server to use
		* @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
		*     not to skip UTF-8 validation for text and close messages
		* @param {Function} [options.verifyClient] A hook to reject connections
		* @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
		*     class to use. It must be the `WebSocket` class or class that extends it
		* @param {Function} [callback] A listener for the `listening` event
		*/
		constructor(options, callback) {
			super();
			options = {
				allowSynchronousEvents: true,
				autoPong: true,
				maxBufferedChunks: 256 * 1024,
				maxFragments: 16 * 1024,
				maxPayload: 100 * 1024 * 1024,
				skipUTF8Validation: false,
				perMessageDeflate: false,
				handleProtocols: null,
				clientTracking: true,
				closeTimeout: CLOSE_TIMEOUT,
				verifyClient: null,
				noServer: false,
				backlog: null,
				server: null,
				host: null,
				path: null,
				port: null,
				WebSocket,
				...options
			};
			if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) throw new TypeError("One and only one of the \"port\", \"server\", or \"noServer\" options must be specified");
			if (options.port != null) {
				this._server = http$1.createServer((req, res) => {
					const body = http$1.STATUS_CODES[426];
					res.writeHead(426, {
						"Content-Length": body.length,
						"Content-Type": "text/plain"
					});
					res.end(body);
				});
				this._server.listen(options.port, options.host, options.backlog, callback);
			} else if (options.server) this._server = options.server;
			if (this._server) {
				const emitConnection = this.emit.bind(this, "connection");
				this._removeListeners = addListeners(this._server, {
					listening: this.emit.bind(this, "listening"),
					error: this.emit.bind(this, "error"),
					upgrade: (req, socket, head) => {
						this.handleUpgrade(req, socket, head, emitConnection);
					}
				});
			}
			if (options.perMessageDeflate === true) options.perMessageDeflate = {};
			if (options.clientTracking) {
				this.clients = new Set();
				this._shouldEmitClose = false;
			}
			this.options = options;
			this._state = RUNNING;
		}
		/**
		* Returns the bound address, the address family name, and port of the server
		* as reported by the operating system if listening on an IP socket.
		* If the server is listening on a pipe or UNIX domain socket, the name is
		* returned as a string.
		*
		* @return {(Object|String|null)} The address of the server
		* @public
		*/
		address() {
			if (this.options.noServer) throw new Error("The server is operating in \"noServer\" mode");
			if (!this._server) return null;
			return this._server.address();
		}
		/**
		* Stop the server from accepting new connections and emit the `'close'` event
		* when all existing connections are closed.
		*
		* @param {Function} [cb] A one-time listener for the `'close'` event
		* @public
		*/
		close(cb) {
			if (this._state === CLOSED) {
				if (cb) this.once("close", () => {
					cb(new Error("The server is not running"));
				});
				process.nextTick(emitClose, this);
				return;
			}
			if (cb) this.once("close", cb);
			if (this._state === CLOSING) return;
			this._state = CLOSING;
			if (this.options.noServer || this.options.server) {
				if (this._server) {
					this._removeListeners();
					this._removeListeners = this._server = null;
				}
				if (this.clients) if (!this.clients.size) process.nextTick(emitClose, this);
				else this._shouldEmitClose = true;
				else process.nextTick(emitClose, this);
			} else {
				const server = this._server;
				this._removeListeners();
				this._removeListeners = this._server = null;
				server.close(() => {
					emitClose(this);
				});
			}
		}
		/**
		* See if a given request should be handled by this server instance.
		*
		* @param {http.IncomingMessage} req Request object to inspect
		* @return {Boolean} `true` if the request is valid, else `false`
		* @public
		*/
		shouldHandle(req) {
			if (this.options.path) {
				const index = req.url.indexOf("?");
				const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
				if (pathname !== this.options.path) return false;
			}
			return true;
		}
		/**
		* Handle a HTTP Upgrade request.
		*
		* @param {http.IncomingMessage} req The request object
		* @param {Duplex} socket The network socket between the server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Function} cb Callback
		* @public
		*/
		handleUpgrade(req, socket, head, cb) {
			socket.on("error", socketOnError);
			const key = req.headers["sec-websocket-key"];
			const upgrade = req.headers.upgrade;
			const version = +req.headers["sec-websocket-version"];
			if (req.method !== "GET") {
				const message = "Invalid HTTP method";
				abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
				return;
			}
			if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
				const message = "Invalid Upgrade header";
				abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
				return;
			}
			if (key === void 0 || !keyRegex.test(key)) {
				const message = "Missing or invalid Sec-WebSocket-Key header";
				abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
				return;
			}
			if (version !== 13 && version !== 8) {
				const message = "Missing or invalid Sec-WebSocket-Version header";
				abortHandshakeOrEmitwsClientError(this, req, socket, 400, message, { "Sec-WebSocket-Version": "13, 8" });
				return;
			}
			if (!this.shouldHandle(req)) {
				abortHandshake(socket, 400);
				return;
			}
			const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
			let protocols = new Set();
			if (secWebSocketProtocol !== void 0) try {
				protocols = subprotocol.parse(secWebSocketProtocol);
			} catch (err) {
				const message = "Invalid Sec-WebSocket-Protocol header";
				abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
				return;
			}
			const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
			const extensions = {};
			if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
				const perMessageDeflate = new PerMessageDeflate({
					...this.options.perMessageDeflate,
					isServer: true,
					maxPayload: this.options.maxPayload
				});
				try {
					const offers = extension.parse(secWebSocketExtensions);
					if (offers[PerMessageDeflate.extensionName]) {
						perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
						extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
					}
				} catch (err) {
					const message = "Invalid or unacceptable Sec-WebSocket-Extensions header";
					abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
					return;
				}
			}
			if (this.options.verifyClient) {
				const info = {
					origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
					secure: !!(req.socket.authorized || req.socket.encrypted),
					req
				};
				if (this.options.verifyClient.length === 2) {
					this.options.verifyClient(info, (verified, code, message, headers) => {
						if (!verified) return abortHandshake(socket, code || 401, message, headers);
						this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
					});
					return;
				}
				if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
			}
			this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
		}
		/**
		* Upgrade the connection to WebSocket.
		*
		* @param {Object} extensions The accepted extensions
		* @param {String} key The value of the `Sec-WebSocket-Key` header
		* @param {Set} protocols The subprotocols
		* @param {http.IncomingMessage} req The request object
		* @param {Duplex} socket The network socket between the server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Function} cb Callback
		* @throws {Error} If called more than once with the same socket
		* @private
		*/
		completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
			if (!socket.readable || !socket.writable) return socket.destroy();
			if (socket[kWebSocket]) throw new Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");
			if (this._state > RUNNING) return abortHandshake(socket, 503);
			const digest = createHash("sha1").update(key + GUID).digest("base64");
			const headers = [
				"HTTP/1.1 101 Switching Protocols",
				"Upgrade: websocket",
				"Connection: Upgrade",
				`Sec-WebSocket-Accept: ${digest}`
			];
			const ws = new this.options.WebSocket(null, void 0, this.options);
			if (protocols.size) {
				const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
				if (protocol) {
					headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
					ws._protocol = protocol;
				}
			}
			if (extensions[PerMessageDeflate.extensionName]) {
				const params = extensions[PerMessageDeflate.extensionName].params;
				const value = extension.format({ [PerMessageDeflate.extensionName]: [params] });
				headers.push(`Sec-WebSocket-Extensions: ${value}`);
				ws._extensions = extensions;
			}
			this.emit("headers", headers, req);
			socket.write(headers.concat("\r\n").join("\r\n"));
			socket.removeListener("error", socketOnError);
			ws.setSocket(socket, head, {
				allowSynchronousEvents: this.options.allowSynchronousEvents,
				maxBufferedChunks: this.options.maxBufferedChunks,
				maxFragments: this.options.maxFragments,
				maxPayload: this.options.maxPayload,
				skipUTF8Validation: this.options.skipUTF8Validation
			});
			if (this.clients) {
				this.clients.add(ws);
				ws.on("close", () => {
					this.clients.delete(ws);
					if (this._shouldEmitClose && !this.clients.size) process.nextTick(emitClose, this);
				});
			}
			cb(ws, req);
		}
	};
	module.exports = WebSocketServer;
	/**
	* Add event listeners on an `EventEmitter` using a map of <event, listener>
	* pairs.
	*
	* @param {EventEmitter} server The event emitter
	* @param {Object.<String, Function>} map The listeners to add
	* @return {Function} A function that will remove the added listeners when
	*     called
	* @private
	*/
	function addListeners(server, map) {
		for (const event of Object.keys(map)) server.on(event, map[event]);
		return function removeListeners() {
			for (const event of Object.keys(map)) server.removeListener(event, map[event]);
		};
	}
	/**
	* Emit a `'close'` event on an `EventEmitter`.
	*
	* @param {EventEmitter} server The event emitter
	* @private
	*/
	function emitClose(server) {
		server._state = CLOSED;
		server.emit("close");
	}
	/**
	* Handle socket errors.
	*
	* @private
	*/
	function socketOnError() {
		this.destroy();
	}
	/**
	* Close the connection when preconditions are not fulfilled.
	*
	* @param {Duplex} socket The socket of the upgrade request
	* @param {Number} code The HTTP response status code
	* @param {String} [message] The HTTP response body
	* @param {Object} [headers] Additional HTTP response headers
	* @private
	*/
	function abortHandshake(socket, code, message, headers) {
		message = message || http$1.STATUS_CODES[code];
		headers = {
			Connection: "close",
			"Content-Type": "text/html",
			"Content-Length": Buffer.byteLength(message),
			...headers
		};
		socket.once("finish", socket.destroy);
		socket.end(`HTTP/1.1 ${code} ${http$1.STATUS_CODES[code]}\r\n` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message);
	}
	/**
	* Emit a `'wsClientError'` event on a `WebSocketServer` if there is at least
	* one listener for it, otherwise call `abortHandshake()`.
	*
	* @param {WebSocketServer} server The WebSocket server
	* @param {http.IncomingMessage} req The request object
	* @param {Duplex} socket The socket of the upgrade request
	* @param {Number} code The HTTP response status code
	* @param {String} message The HTTP response body
	* @param {Object} [headers] The HTTP response headers
	* @private
	*/
	function abortHandshakeOrEmitwsClientError(server, req, socket, code, message, headers) {
		if (server.listenerCount("wsClientError")) {
			const err = new Error(message);
			Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
			server.emit("wsClientError", err, socket, req);
		} else abortHandshake(socket, code, message, headers);
	}
} });

//#endregion
//#region node_modules/ws/wrapper.mjs
var wrapper_default = import_websocket.default;

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/protocol/gateway/codec.js
/**
* Gateway message decoding utilities.
*
* Handles the various data formats that the QQ Bot WebSocket can deliver
* (string, Buffer, Buffer[], ArrayBuffer).
*/
function decodeGatewayMessageData(data) {
	if (typeof data === "string") return data;
	if (Buffer.isBuffer(data)) return data.toString("utf8");
	if (Array.isArray(data) && data.every((chunk) => Buffer.isBuffer(chunk))) return Buffer.concat(data).toString("utf8");
	if (data instanceof ArrayBuffer) return Buffer.from(data).toString("utf8");
	if (ArrayBuffer.isView(data)) return Buffer.from(data.buffer, data.byteOffset, data.byteLength).toString("utf8");
	return "";
}
function readOptionalMessageSceneExt(event) {
	if (!("message_scene" in event)) return void 0;
	const scene = event.message_scene;
	return scene?.ext;
}

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/protocol/gateway/constants.js
/**
* QQ Bot WebSocket Gateway protocol constants.
*
* Pure protocol-layer constants. Zero external dependencies.
*/
/** QQ Bot WebSocket intents grouped by permission level. */
const INTENTS = {
	GUILDS: 1,
	GUILD_MEMBERS: 2,
	PUBLIC_GUILD_MESSAGES: 1 << 30,
	DIRECT_MESSAGE: 4096,
	GROUP_AND_C2C: 1 << 25,
	INTERACTION: 1 << 26
};
const FULL_INTENTS = INTENTS.GUILDS | INTENTS.GUILD_MEMBERS | INTENTS.PUBLIC_GUILD_MESSAGES | INTENTS.DIRECT_MESSAGE | INTENTS.GROUP_AND_C2C | INTENTS.INTERACTION;
const RECONNECT_DELAYS = [
	1e3,
	2e3,
	5e3,
	1e4,
	3e4,
	6e4
];
const RATE_LIMIT_DELAY = 6e4;
const MAX_RECONNECT_ATTEMPTS = 100;
const MAX_QUICK_DISCONNECT_COUNT = 3;
const QUICK_DISCONNECT_THRESHOLD = 5e3;
/** Gateway opcodes used by the QQ Bot WebSocket protocol. */
const GatewayOp = {
	DISPATCH: 0,
	HEARTBEAT: 1,
	IDENTIFY: 2,
	RESUME: 6,
	RECONNECT: 7,
	INVALID_SESSION: 9,
	HELLO: 10,
	HEARTBEAT_ACK: 11
};
/** WebSocket close codes used by the QQ Gateway. */
const GatewayCloseCode = {
	NORMAL: 1e3,
	AUTH_FAILED: 4004,
	INVALID_SESSION: 4006,
	SEQ_OUT_OF_RANGE: 4007,
	RATE_LIMITED: 4008,
	SESSION_TIMEOUT: 4009,
	SERVER_ERROR_START: 4900,
	SERVER_ERROR_END: 4913,
	INSUFFICIENT_INTENTS: 4914,
	DISALLOWED_INTENTS: 4915
};
/** Event type strings dispatched under opcode 0 (DISPATCH). */
const GatewayEvent = {
	READY: "READY",
	RESUMED: "RESUMED",
	C2C_MESSAGE_CREATE: "C2C_MESSAGE_CREATE",
	AT_MESSAGE_CREATE: "AT_MESSAGE_CREATE",
	DIRECT_MESSAGE_CREATE: "DIRECT_MESSAGE_CREATE",
	GROUP_AT_MESSAGE_CREATE: "GROUP_AT_MESSAGE_CREATE",
	GROUP_MESSAGE_CREATE: "GROUP_MESSAGE_CREATE",
	INTERACTION_CREATE: "INTERACTION_CREATE",
	GUILD_CREATE: "GUILD_CREATE",
	GUILD_UPDATE: "GUILD_UPDATE",
	GUILD_DELETE: "GUILD_DELETE",
	GUILD_MEMBER_ADD: "GUILD_MEMBER_ADD",
	GUILD_MEMBER_UPDATE: "GUILD_MEMBER_UPDATE",
	GUILD_MEMBER_REMOVE: "GUILD_MEMBER_REMOVE",
	CHANNEL_CREATE: "CHANNEL_CREATE",
	CHANNEL_UPDATE: "CHANNEL_UPDATE",
	CHANNEL_DELETE: "CHANNEL_DELETE",
	GROUP_ADD_ROBOT: "GROUP_ADD_ROBOT",
	GROUP_DEL_ROBOT: "GROUP_DEL_ROBOT",
	GROUP_MSG_REJECT: "GROUP_MSG_REJECT",
	GROUP_MSG_RECEIVE: "GROUP_MSG_RECEIVE",
	FRIEND_ADD: "FRIEND_ADD",
	FRIEND_DEL: "FRIEND_DEL",
	C2C_MSG_REJECT: "C2C_MSG_REJECT",
	C2C_MSG_RECEIVE: "C2C_MSG_RECEIVE",
	MESSAGE_REACTION_ADD: "MESSAGE_REACTION_ADD",
	MESSAGE_REACTION_REMOVE: "MESSAGE_REACTION_REMOVE"
};

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/protocol/gateway/event-dispatcher.js
const REF_INDEX_KEY = "msg_idx";
/**
* Parse `ref_idx` and `msg_idx` from message_scene.ext + msg_elements.
*/
function parseRefIndices(ext, msgType, msgElements) {
	let refMsgIdx;
	let msgIdx;
	if (Array.isArray(ext)) for (const entry of ext) {
		if (typeof entry !== "string") continue;
		const eq = entry.indexOf("=");
		if (eq < 0) continue;
		const key = entry.slice(0, eq).trim();
		const val = entry.slice(eq + 1).trim();
		if (!val) continue;
		if (key === REF_INDEX_KEY) msgIdx = val;
		else if (key === "ref_msg_idx") refMsgIdx = val;
	}
	if (msgType === 103 && Array.isArray(msgElements)) {
		for (const el of msgElements) if (el?.msg_idx) {
			refMsgIdx = el.msg_idx;
			break;
		}
	}
	return {
		refMsgIdx,
		msgIdx
	};
}
function dispatchEvent(eventType, data, _accountId, _log) {
	if (eventType === GatewayEvent.READY) {
		const d = data;
		return {
			action: "ready",
			data,
			sessionId: d.session_id
		};
	}
	if (eventType === GatewayEvent.RESUMED) return {
		action: "resumed",
		data
	};
	if (eventType === GatewayEvent.C2C_MESSAGE_CREATE) {
		const ev = data;
		const refs = parseRefIndices(ev.message_scene?.ext, ev.message_type, ev.msg_elements);
		return {
			action: "message",
			msg: {
				rawEventType: eventType,
				kind: "c2c",
				senderId: ev.author.user_openid,
				content: ev.content,
				messageId: ev.id,
				timestamp: ev.timestamp,
				attachments: ev.attachments,
				refMsgIdx: refs.refMsgIdx,
				msgIdx: refs.msgIdx,
				msgType: ev.message_type,
				messageScene: ev.message_scene,
				msgElements: ev.msg_elements,
				raw: ev
			}
		};
	}
	if (eventType === GatewayEvent.AT_MESSAGE_CREATE) {
		const ev = data;
		const refs = parseRefIndices(readOptionalMessageSceneExt(ev));
		return {
			action: "message",
			msg: {
				rawEventType: eventType,
				kind: "guild",
				senderId: ev.author.id,
				senderName: ev.author.username,
				content: ev.content,
				messageId: ev.id,
				timestamp: ev.timestamp,
				channelId: ev.channel_id,
				guildId: ev.guild_id,
				attachments: ev.attachments,
				refMsgIdx: refs.refMsgIdx,
				msgIdx: refs.msgIdx,
				raw: ev
			}
		};
	}
	if (eventType === GatewayEvent.DIRECT_MESSAGE_CREATE) {
		const ev = data;
		const refs = parseRefIndices(readOptionalMessageSceneExt(ev));
		return {
			action: "message",
			msg: {
				rawEventType: eventType,
				kind: "dm",
				senderId: ev.author.id,
				senderName: ev.author.username,
				content: ev.content,
				messageId: ev.id,
				timestamp: ev.timestamp,
				guildId: ev.guild_id,
				attachments: ev.attachments,
				refMsgIdx: refs.refMsgIdx,
				msgIdx: refs.msgIdx,
				raw: ev
			}
		};
	}
	if (eventType === GatewayEvent.GROUP_AT_MESSAGE_CREATE || eventType === GatewayEvent.GROUP_MESSAGE_CREATE) {
		const ev = data;
		const refs = parseRefIndices(ev.message_scene?.ext, ev.message_type, ev.msg_elements);
		return {
			action: "message",
			msg: {
				rawEventType: eventType,
				kind: "group",
				senderId: ev.author.member_openid,
				senderName: ev.author.username,
				senderIsBot: ev.author.bot,
				content: ev.content,
				messageId: ev.id,
				timestamp: ev.timestamp,
				groupOpenid: ev.group_openid,
				attachments: ev.attachments,
				refMsgIdx: refs.refMsgIdx,
				msgIdx: refs.msgIdx,
				msgType: ev.message_type,
				mentions: ev.mentions,
				messageScene: ev.message_scene,
				msgElements: ev.msg_elements,
				raw: ev
			}
		};
	}
	if (eventType === GatewayEvent.INTERACTION_CREATE) return {
		action: "interaction",
		event: data
	};
	return {
		action: "raw",
		type: eventType,
		data
	};
}

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/protocol/gateway/reconnect.js
var ReconnectState = class {
	accountId;
	log;
	attempts = 0;
	lastConnectTime = 0;
	quickDisconnectCount = 0;
	constructor(accountId, log) {
		this.accountId = accountId;
		this.log = log;
	}
	onConnected() {
		this.attempts = 0;
		this.lastConnectTime = Date.now();
	}
	isExhausted() {
		return this.attempts >= MAX_RECONNECT_ATTEMPTS;
	}
	getNextDelay(customDelay) {
		const delay = customDelay ?? RECONNECT_DELAYS[Math.min(this.attempts, RECONNECT_DELAYS.length - 1)];
		this.attempts++;
		this.log?.debug?.(`[${this.accountId}] Reconnecting in ${delay}ms (attempt ${this.attempts})`);
		return delay;
	}
	handleClose(code, isAborted) {
		if (code === GatewayCloseCode.INSUFFICIENT_INTENTS || code === GatewayCloseCode.DISALLOWED_INTENTS) {
			const reason = code === GatewayCloseCode.INSUFFICIENT_INTENTS ? "offline/sandbox-only" : "banned";
			this.log?.error(`[${this.accountId}] Bot is ${reason}. Please contact QQ platform.`);
			return {
				shouldReconnect: false,
				clearSession: false,
				refreshToken: false,
				fatal: true,
				reason
			};
		}
		if (code === GatewayCloseCode.AUTH_FAILED) {
			this.log?.info(`[${this.accountId}] Invalid token (4004), will refresh token and reconnect`);
			return {
				shouldReconnect: !isAborted,
				clearSession: false,
				refreshToken: true,
				fatal: false,
				reason: "invalid token (4004)"
			};
		}
		if (code === GatewayCloseCode.RATE_LIMITED) {
			this.log?.info(`[${this.accountId}] Rate limited (4008), waiting ${RATE_LIMIT_DELAY}ms`);
			return {
				shouldReconnect: !isAborted,
				reconnectDelay: RATE_LIMIT_DELAY,
				clearSession: false,
				refreshToken: false,
				fatal: false,
				reason: "rate limited (4008)"
			};
		}
		if (code === GatewayCloseCode.INVALID_SESSION || code === GatewayCloseCode.SEQ_OUT_OF_RANGE || code === GatewayCloseCode.SESSION_TIMEOUT) {
			const codeDesc = {
				[GatewayCloseCode.INVALID_SESSION]: "session no longer valid",
				[GatewayCloseCode.SEQ_OUT_OF_RANGE]: "invalid seq on resume",
				[GatewayCloseCode.SESSION_TIMEOUT]: "session timed out"
			};
			this.log?.info(`[${this.accountId}] Error ${code} (${codeDesc[code]}), will re-identify`);
			return {
				shouldReconnect: !isAborted,
				clearSession: true,
				refreshToken: true,
				fatal: false,
				reason: codeDesc[code]
			};
		}
		if (code >= GatewayCloseCode.SERVER_ERROR_START && code <= GatewayCloseCode.SERVER_ERROR_END) {
			this.log?.info(`[${this.accountId}] Internal error (${code}), will re-identify`);
			return {
				shouldReconnect: !isAborted && code !== GatewayCloseCode.NORMAL,
				clearSession: true,
				refreshToken: true,
				fatal: false,
				reason: `internal error (${code})`
			};
		}
		const connectionDuration = Date.now() - this.lastConnectTime;
		if (connectionDuration < QUICK_DISCONNECT_THRESHOLD && this.lastConnectTime > 0) {
			this.quickDisconnectCount++;
			this.log?.debug?.(`[${this.accountId}] Quick disconnect detected (${connectionDuration}ms), count: ${this.quickDisconnectCount}`);
			if (this.quickDisconnectCount >= MAX_QUICK_DISCONNECT_COUNT) {
				this.log?.error(`[${this.accountId}] Too many quick disconnects. This may indicate a permission issue.`);
				this.quickDisconnectCount = 0;
				return {
					shouldReconnect: !isAborted && code !== 1e3,
					reconnectDelay: RATE_LIMIT_DELAY,
					clearSession: false,
					refreshToken: false,
					fatal: false,
					reason: "too many quick disconnects"
				};
			}
		} else this.quickDisconnectCount = 0;
		return {
			shouldReconnect: !isAborted && code !== GatewayCloseCode.NORMAL,
			clearSession: false,
			refreshToken: false,
			fatal: false,
			reason: `close code ${code}`
		};
	}
};

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/protocol/gateway/gateway-connection.js
/** Pure-protocol gateway connection. */
var GatewayConnection = class {
	isAborted = false;
	currentWs = null;
	heartbeatInterval = null;
	sessionId = null;
	lastSeq = null;
	isConnecting = false;
	reconnectTimer = null;
	shouldRefreshToken = false;
	reconnect;
	opts;
	resolveUserAgent;
	constructor(opts) {
		this.opts = opts;
		this.reconnect = new ReconnectState(opts.account.accountId, opts.log);
		const ua = opts.userAgent ?? "qqbot-nodejs/unknown";
		this.resolveUserAgent = typeof ua === "function" ? ua : () => ua;
	}
	/** Start the connection loop. Resolves when abortSignal fires. */
	async start() {
		this.restoreSession();
		this.registerAbortHandler();
		await this.connect();
		return new Promise((resolve$1) => {
			this.opts.abortSignal.addEventListener("abort", () => resolve$1());
		});
	}
	restoreSession() {
		const saved = this.opts.session?.load();
		if (saved) {
			this.sessionId = saved.sessionId;
			this.lastSeq = saved.lastSeq;
			this.opts.log?.info?.(`[${this.opts.account.accountId}] Restored session: sessionId=${saved.sessionId}, lastSeq=${saved.lastSeq}`);
		}
	}
	saveCurrentSession() {
		if (!this.sessionId || !this.opts.session) return;
		this.opts.session.save({
			sessionId: this.sessionId,
			lastSeq: this.lastSeq
		});
	}
	registerAbortHandler() {
		this.opts.abortSignal.addEventListener("abort", () => {
			this.isAborted = true;
			if (this.reconnectTimer) {
				clearTimeout(this.reconnectTimer);
				this.reconnectTimer = null;
			}
			this.cleanup();
		});
	}
	cleanup() {
		if (this.heartbeatInterval) {
			clearInterval(this.heartbeatInterval);
			this.heartbeatInterval = null;
		}
		if (this.currentWs && (this.currentWs.readyState === wrapper_default.OPEN || this.currentWs.readyState === wrapper_default.CONNECTING)) this.currentWs.close();
		this.currentWs = null;
	}
	scheduleReconnect(customDelay) {
		if (this.isAborted || this.reconnect.isExhausted()) {
			this.opts.log?.error(`[${this.opts.account.accountId}] Max reconnect attempts reached or aborted`);
			return;
		}
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}
		const delay = this.reconnect.getNextDelay(customDelay);
		this.reconnectTimer = setTimeout(() => {
			this.reconnectTimer = null;
			if (!this.isAborted) this.connect();
		}, delay);
	}
	async connect() {
		const { log, account } = this.opts;
		if (this.isConnecting) {
			log?.debug?.(`[${account.accountId}] Already connecting, skip`);
			return;
		}
		this.isConnecting = true;
		try {
			this.cleanup();
			if (this.shouldRefreshToken) {
				log?.debug?.(`[${account.accountId}] Refreshing token...`);
				this.opts.clearTokenCache?.();
				this.shouldRefreshToken = false;
			}
			const accessToken = await this.opts.getAccessToken();
			log?.info(`[${account.accountId}] ✅ Access token obtained`);
			const gatewayUrl = await this.opts.getGatewayUrl(accessToken);
			log?.info(`[${account.accountId}] Connecting to ${gatewayUrl}`);
			const ws = new wrapper_default(gatewayUrl, { headers: { "User-Agent": this.resolveUserAgent() } });
			this.currentWs = ws;
			ws.on("open", () => {
				log?.info(`[${account.accountId}] WebSocket connected`);
				this.isConnecting = false;
				this.reconnect.onConnected();
			});
			ws.on("message", async (data) => {
				try {
					const rawData = decodeGatewayMessageData(data);
					const payload = JSON.parse(rawData);
					const { op, d, s, t } = payload;
					if (s) {
						this.lastSeq = s;
						this.saveCurrentSession();
					}
					switch (op) {
						case GatewayOp.HELLO:
							this.handleHello(ws, d, accessToken);
							break;
						case GatewayOp.DISPATCH: {
							log?.debug?.(`[${account.accountId}] Dispatch event: t=${t} payload=${previewPayload(d)}`);
							const result = dispatchEvent(t ?? "", d, account.accountId, log);
							if (result.action === "ready") {
								this.sessionId = result.sessionId;
								this.saveCurrentSession();
								this.opts.onReady?.(result.data);
							} else if (result.action === "resumed") {
								(this.opts.onResumed ?? this.opts.onReady)?.(result.data);
								this.saveCurrentSession();
							} else if (result.action === "interaction") {
								if (this.opts.onInteraction) Promise.resolve(this.opts.onInteraction(result.event));
								else if (this.opts.onRawEvent) Promise.resolve(this.opts.onRawEvent(payload.t, payload.d));
							} else if (result.action === "message") Promise.resolve(this.opts.onMessage(result.msg));
							else if (result.action === "raw") {
								if (this.opts.onRawEvent) Promise.resolve(this.opts.onRawEvent(result.type, result.data));
							}
							break;
						}
						case GatewayOp.HEARTBEAT_ACK: break;
						case GatewayOp.RECONNECT:
							this.cleanup();
							this.scheduleReconnect();
							break;
						case GatewayOp.INVALID_SESSION: {
							const canResume = d;
							if (!canResume) {
								this.sessionId = null;
								this.lastSeq = null;
								this.opts.session?.clear();
								this.shouldRefreshToken = true;
							}
							this.cleanup();
							this.scheduleReconnect(3e3);
							break;
						}
					}
				} catch (err) {
					log?.error(`[${account.accountId}] Message parse error: ${err instanceof Error ? err.message : String(err)}`);
				}
			});
			ws.on("close", (code, reason) => {
				log?.info(`[${account.accountId}] WebSocket closed: ${code} ${reason.toString()}`);
				this.isConnecting = false;
				this.handleClose(code);
			});
			ws.on("error", (err) => {
				log?.error(`[${account.accountId}] WebSocket error: ${err.message}`);
				this.opts.onError?.(err);
			});
		} catch (err) {
			this.isConnecting = false;
			const errMsg = err instanceof Error ? err.message : String(err);
			log?.error(`[${account.accountId}] Connection failed: ${errMsg}`);
			if (errMsg.includes("Too many requests") || errMsg.includes("100001")) this.scheduleReconnect(RATE_LIMIT_DELAY);
			else this.scheduleReconnect();
		}
	}
	handleHello(ws, d, accessToken) {
		const intents = this.opts.intents ?? FULL_INTENTS;
		if (this.sessionId && this.lastSeq !== null) ws.send(JSON.stringify({
			op: GatewayOp.RESUME,
			d: {
				token: `QQBot ${accessToken}`,
				session_id: this.sessionId,
				seq: this.lastSeq
			}
		}));
		else ws.send(JSON.stringify({
			op: GatewayOp.IDENTIFY,
			d: {
				token: `QQBot ${accessToken}`,
				intents,
				shard: [0, 1]
			}
		}));
		const interval = d.heartbeat_interval;
		if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
		this.heartbeatInterval = setInterval(() => {
			if (ws.readyState === wrapper_default.OPEN) ws.send(JSON.stringify({
				op: GatewayOp.HEARTBEAT,
				d: this.lastSeq
			}));
		}, interval);
	}
	handleClose(code) {
		const action = this.reconnect.handleClose(code, this.isAborted);
		if (action.clearSession) {
			this.sessionId = null;
			this.lastSeq = null;
			this.opts.session?.clear();
		}
		if (action.refreshToken) this.shouldRefreshToken = true;
		this.cleanup();
		if (action.fatal) return;
		if (action.shouldReconnect) this.scheduleReconnect(action.reconnectDelay);
	}
};
/**
* Serialize a gateway event payload for debug logging.
*
* JSON-stringifies the payload; returns `"(non-serializable)"` for cyclic
* or otherwise unserializable values so logging never throws.
*/
function previewPayload(data) {
	if (data === void 0) return "undefined";
	if (data === null) return "null";
	try {
		const s = JSON.stringify(data);
		return s === void 0 ? "(non-serializable)" : s;
	} catch {
		return "(non-serializable)";
	}
}

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/protocol/transport/webhook-verify.js
/**
* Derive an Ed25519 seed (32 bytes) from the bot secret.
* QQ's spec: repeat the secret until >= 32 chars, then truncate to 32.
*/
function deriveSeed(botSecret) {
	let seed = botSecret;
	while (seed.length < 32) seed = seed + seed;
	return Buffer.from(seed.slice(0, 32), "utf-8");
}
/**
* Generate Ed25519 key pair from bot secret.
*/
function getKeyPair(botSecret) {
	const seed = deriveSeed(botSecret);
	const privateKey = crypto$1.createPrivateKey({
		key: Buffer.concat([Buffer.from("302e020100300506032b657004220420", "hex"), seed]),
		format: "der",
		type: "pkcs8"
	});
	const publicKey = crypto$1.createPublicKey(privateKey);
	return {
		privateKey,
		publicKey
	};
}
/**
* Sign a message using the bot's Ed25519 private key.
* Returns hex-encoded signature.
*/
function ed25519Sign(botSecret, message) {
	const { privateKey } = getKeyPair(botSecret);
	const signature = crypto$1.sign(null, message, privateKey);
	return signature.toString("hex");
}
/**
* Verify an Ed25519 signature from a QQ webhook callback request.
*
* @param params.body - Raw request body (Buffer)
* @param params.timestamp - Value of `X-Signature-Timestamp` header
* @param params.signature - Value of `X-Signature-Ed25519` header (hex string)
* @param params.botSecret - The bot's AppSecret
* @returns `true` if signature is valid
*/
function verifyWebhookSignature(params) {
	const { body, timestamp, signature, botSecret } = params;
	try {
		const { publicKey } = getKeyPair(botSecret);
		const message = Buffer.concat([Buffer.from(timestamp, "utf-8"), body]);
		const sigBuffer = Buffer.from(signature, "hex");
		return crypto$1.verify(null, message, publicKey, sigBuffer);
	} catch {
		return false;
	}
}
/**
* Generate the response for callback URL validation (op:13).
*
* QQ sends `{ op: 13, d: { plain_token, event_ts } }` to verify
* the callback URL. We must return `{ plain_token, signature }`.
*
* @param params.plainToken - The `plain_token` from the validation request
* @param params.eventTs - The `event_ts` from the validation request
* @param params.botSecret - The bot's AppSecret
*/
function signValidationResponse(params) {
	const { plainToken, eventTs, botSecret } = params;
	const message = Buffer.from(eventTs + plainToken, "utf-8");
	const signature = ed25519Sign(botSecret, message);
	return {
		plain_token: plainToken,
		signature
	};
}

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/protocol/transport/webhook-server-node.js
var NodeHttpWebhookServer = class {
	server = null;
	async listen(port, path$1, handler) {
		return new Promise((resolve$1, reject) => {
			const server = http.createServer(async (req, res) => {
				if (req.method !== "POST" || req.url !== path$1) {
					res.writeHead(404, { "Content-Type": "text/plain" });
					res.end("Not Found");
					return;
				}
				const chunks = [];
				req.on("data", (chunk) => chunks.push(chunk));
				req.on("end", async () => {
					try {
						const body = Buffer.concat(chunks);
						const headers = {};
						for (const [key, value] of Object.entries(req.headers)) headers[key.toLowerCase()] = value;
						const response = await handler({
							body,
							headers
						});
						res.writeHead(response.status, {
							"Content-Type": "application/json",
							...response.headers ?? {}
						});
						res.end(response.body);
					} catch (_err) {
						res.writeHead(500, { "Content-Type": "text/plain" });
						res.end("Internal Server Error");
					}
				});
			});
			server.on("error", reject);
			server.listen(port, () => {
				this.server = server;
				resolve$1();
			});
		});
	}
	close() {
		if (this.server) {
			this.server.close();
			this.server = null;
		}
	}
};

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/protocol/transport/webhook.js
const OP_DISPATCH = 0;
const OP_HTTP_CALLBACK_ACK = 12;
const OP_VALIDATION = 13;
var WebhookTransport = class {
	opts;
	callbacks;
	log;
	server;
	accountId;
	stopped = false;
	stopResolve = null;
	constructor(opts, callbacks) {
		this.opts = opts;
		this.callbacks = callbacks;
		this.log = opts.log;
		this.server = opts.server ?? new NodeHttpWebhookServer();
		this.accountId = opts.accountId ?? opts.appId;
	}
	async start() {
		const port = this.opts.port ?? 8080;
		const path$1 = this.opts.path ?? "/";
		this.log?.info?.(`[webhook] starting on port ${port}, path ${path$1}`);
		await this.server.listen(port, path$1, (req) => this.handleRequest(req));
		this.log?.info?.(`[webhook] listening on :${port}${path$1}`);
		this.callbacks.onReady?.({
			transport: "webhook",
			port,
			path: path$1
		});
		if (this.opts.abortSignal) await new Promise((resolve$1) => {
			if (this.opts.abortSignal.aborted) {
				resolve$1();
				return;
			}
			this.stopResolve = resolve$1;
			this.opts.abortSignal.addEventListener("abort", () => this.stop(), { once: true });
		});
		else await new Promise((resolve$1) => {
			this.stopResolve = resolve$1;
		});
	}
	stop() {
		if (this.stopped) return;
		this.stopped = true;
		this.server.close();
		this.log?.info?.(`[webhook] stopped`);
		this.stopResolve?.();
	}
	async handleRequest(req) {
		let payload;
		try {
			payload = JSON.parse(req.body.toString("utf-8"));
		} catch {
			this.log?.warn?.(`[webhook] invalid JSON body`);
			return {
				status: 400,
				body: JSON.stringify({ error: "invalid json" })
			};
		}
		if (payload.op === OP_VALIDATION) return this.handleValidation(payload);
		const timestamp = getHeader(req.headers, "x-signature-timestamp") ?? "";
		const signature = getHeader(req.headers, "x-signature-ed25519") ?? "";
		if (!timestamp || !signature) {
			this.log?.warn?.(`[webhook] missing signature headers`);
			return {
				status: 401,
				body: JSON.stringify({ error: "missing signature" })
			};
		}
		const valid = verifyWebhookSignature({
			body: req.body,
			timestamp,
			signature,
			botSecret: this.opts.appSecret
		});
		if (!valid) {
			this.log?.warn?.(`[webhook] signature verification failed`);
			return {
				status: 401,
				body: JSON.stringify({ error: "invalid signature" })
			};
		}
		if (payload.op === OP_DISPATCH) this.handleDispatch(payload).catch((err) => {
			this.log?.error?.(`[webhook] dispatch error: ${err instanceof Error ? err.message : String(err)}`);
		});
		return {
			status: 200,
			body: JSON.stringify({
				op: OP_HTTP_CALLBACK_ACK,
				d: 0
			})
		};
	}
	handleValidation(payload) {
		const d = payload.d;
		if (!d?.plain_token || !d?.event_ts) {
			this.log?.warn?.(`[webhook] validation missing plain_token or event_ts`);
			return {
				status: 400,
				body: JSON.stringify({ error: "invalid validation" })
			};
		}
		this.log?.info?.(`[webhook] handling callback URL validation`);
		const response = signValidationResponse({
			plainToken: d.plain_token,
			eventTs: d.event_ts,
			botSecret: this.opts.appSecret
		});
		return {
			status: 200,
			body: JSON.stringify(response)
		};
	}
	async handleDispatch(payload) {
		const eventType = payload.t ?? "";
		const data = payload.d;
		this.log?.debug?.(`[webhook] dispatch event: t=${eventType} payload=${JSON.stringify(data)}`);
		const result = dispatchEvent(eventType, data, this.accountId, this.log);
		switch (result.action) {
			case "ready":
				this.callbacks.onReady?.(result.data);
				break;
			case "resumed":
				this.callbacks.onResumed?.(result.data);
				break;
			case "message":
				try {
					await this.callbacks.onMessage(result.msg);
				} catch (err) {
					this.callbacks.onError?.(err instanceof Error ? err : new Error(String(err)));
				}
				break;
			case "interaction":
				try {
					await this.callbacks.onInteraction?.(result.event);
				} catch (err) {
					this.callbacks.onError?.(err instanceof Error ? err : new Error(String(err)));
				}
				break;
			case "ignore": break;
		}
	}
};
function getHeader(headers, key) {
	const val = headers[key];
	if (Array.isArray(val)) return val[0];
	return val;
}

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/protocol/utils/upload-cache.js
const MAX_CACHE_SIZE = 500;
/** Compute an MD5 hash used as part of the cache key. */
function computeFileHash(data) {
	return crypto.createHash("md5").update(data).digest("hex");
}
function buildCacheKey(contentHash, scope, targetId, fileType) {
	return `${contentHash}:${scope}:${targetId}:${fileType}`;
}
/**
* In-memory upload cache. Each {@link QQBot} instance owns its own
* cache so multiple concurrent bots do not compete for the same map.
*/
var UploadCache = class {
	cache = new Map();
	logger;
	constructor(options) {
		this.logger = options?.logger;
	}
	computeHash(data) {
		return computeFileHash(data);
	}
	get(contentHash, scope, targetId, fileType) {
		const key = buildCacheKey(contentHash, scope, targetId, fileType);
		const entry = this.cache.get(key);
		if (!entry) return null;
		if (Date.now() >= entry.expiresAt) {
			this.cache.delete(key);
			return null;
		}
		this.logger?.debug?.(`[upload-cache] HIT key=${key.slice(0, 40)}... uuid=${entry.fileUuid}`);
		return entry.fileInfo;
	}
	set(contentHash, scope, targetId, fileType, fileInfo, fileUuid, ttl) {
		if (this.cache.size >= MAX_CACHE_SIZE) {
			const now = Date.now();
			for (const [k, v] of this.cache) if (now >= v.expiresAt) this.cache.delete(k);
			if (this.cache.size >= MAX_CACHE_SIZE) {
				const keys = Array.from(this.cache.keys());
				for (let i = 0; i < keys.length / 2; i++) this.cache.delete(keys[i]);
			}
		}
		const key = buildCacheKey(contentHash, scope, targetId, fileType);
		const safetyMargin = 60;
		const effectiveTtl = Math.max(ttl - safetyMargin, 10);
		this.cache.set(key, {
			fileInfo,
			fileUuid,
			expiresAt: Date.now() + effectiveTtl * 1e3
		});
		this.logger?.debug?.(`[upload-cache] SET key=${key.slice(0, 40)}... ttl=${effectiveTtl}s uuid=${fileUuid}`);
	}
	stats() {
		return {
			size: this.cache.size,
			maxSize: MAX_CACHE_SIZE
		};
	}
	clear() {
		this.cache.clear();
		this.logger?.debug?.(`[upload-cache] cleared`);
	}
};

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/streaming.js
/** Throttle constants — match QQ open platform best practice. */
const DEFAULT_THROTTLE_MS = 500;
const MIN_THROTTLE_MS = 300;
/**
* Lightweight controller for QQ C2C stream messages.
*
* Usage:
* ```ts
* const stream = bot.openStream({ openid, msgId });
* for (const chunk of chunks) {
*   await stream.update(currentText);  // currentText is the full text so far
* }
* await stream.complete();             // marks input_state = DONE
* ```
*
* Important: `update()` expects the *full* current message text, not the
* delta. The QQ API uses `input_mode=replace` semantics — each frame
* replaces the previous one in place.
*/
/** Maximum number of retries on rate-limit (429 / 50002). */
const MAX_FLUSH_RETRIES = 3;
/** Base delay for exponential backoff on rate-limit (ms). */
const RATE_LIMIT_BASE_DELAY_MS = 1e3;
var StreamSession = class {
	api;
	opts;
	throttleMs;
	eventId;
	streamMsgId;
	index = 0;
	/**
	* `msg_seq` for the current stream session. QQ open platform expects all
	* frames in one stream to share the same `msg_seq` (only `index` advances).
	*/
	msgSeq = null;
	lastFlushAt = 0;
	lastSentText = "";
	pendingText = "";
	pendingTimer = null;
	flushInProgress = false;
	flushPromise = null;
	isCompleted = false;
	constructor(api, opts) {
		this.api = api;
		this.opts = opts;
		this.throttleMs = Math.max(opts.throttleMs ?? DEFAULT_THROTTLE_MS, MIN_THROTTLE_MS);
		this.eventId = opts.eventId ?? opts.msgId;
	}
	/**
	* Update the current full message text. Will be sent at most once per
	* throttle window.
	*/
	async update(fullText) {
		if (this.isCompleted) return;
		this.pendingText = fullText;
		const now = Date.now();
		const elapsed = now - this.lastFlushAt;
		if (this.flushInProgress) return;
		if (elapsed >= this.throttleMs) {
			await this.flush(StreamInputState.GENERATING);
			return;
		}
		if (!this.pendingTimer) {
			const wait = this.throttleMs - elapsed;
			this.pendingTimer = setTimeout(() => {
				this.pendingTimer = null;
				if (!this.isCompleted) this.flush(StreamInputState.GENERATING).catch((err) => {
					this.opts.logger?.error?.(`[qqbot:stream] throttle flush error: ${formatErrorMessage(err)}`);
				});
			}, wait);
		}
	}
	/** Mark the stream as DONE. Sends a final frame with the latest text. */
	async complete() {
		if (this.isCompleted) return void 0;
		this.isCompleted = true;
		if (this.pendingTimer) {
			clearTimeout(this.pendingTimer);
			this.pendingTimer = null;
		}
		if (this.flushPromise) await this.flushPromise.catch(() => {});
		return this.flush(StreamInputState.DONE);
	}
	/** Force-cancel without sending a DONE frame (caller must clean up). */
	cancel() {
		this.isCompleted = true;
		if (this.pendingTimer) {
			clearTimeout(this.pendingTimer);
			this.pendingTimer = null;
		}
	}
	async flush(state) {
		if (this.flushInProgress) return void 0;
		if (this.pendingText === this.lastSentText && state !== StreamInputState.DONE) return void 0;
		this.flushInProgress = true;
		const promise = this.doFlush(state);
		this.flushPromise = promise;
		return promise;
	}
	async doFlush(state) {
		let flushFailed = false;
		try {
			const text = this.pendingText;
			if (this.msgSeq === null) this.msgSeq = getNextMsgSeq(this.opts.msgId);
			const currentIndex = this.index++;
			const req = {
				input_mode: StreamInputMode.REPLACE,
				input_state: state,
				content_type: StreamContentType.MARKDOWN,
				content_raw: text,
				event_id: this.eventId,
				msg_id: this.opts.msgId,
				msg_seq: this.msgSeq,
				index: currentIndex
			};
			if (this.streamMsgId) req.stream_msg_id = this.streamMsgId;
			const resp = await this.sendWithRetry(req);
			if (resp?.id && !this.streamMsgId) this.streamMsgId = resp.id;
			this.lastSentText = text;
			this.lastFlushAt = Date.now();
			return resp;
		} catch (err) {
			flushFailed = true;
			this.opts.logger?.error?.(`[qqbot:stream] flush failed (state=${state}): ${formatErrorMessage(err)}`);
			throw err;
		} finally {
			this.flushInProgress = false;
			if (!flushFailed && !this.isCompleted && this.pendingText !== this.lastSentText && !this.pendingTimer && state !== StreamInputState.DONE) await this.flush(StreamInputState.GENERATING);
		}
	}
	/**
	* Send a stream message with exponential backoff on rate-limit errors.
	* QQ returns err_code 50002 or HTTP 429 when rate-limited.
	*/
	async sendWithRetry(req) {
		for (let attempt = 0; attempt <= MAX_FLUSH_RETRIES; attempt++) try {
			return await this.api.sendC2CStreamMessage(this.opts.creds, this.opts.openid, req);
		} catch (err) {
			if (!this.isRateLimitError(err) || attempt >= MAX_FLUSH_RETRIES) throw err;
			const delay = RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, attempt);
			this.opts.logger?.debug?.(`[qqbot:stream] rate limited, retry ${attempt + 1}/${MAX_FLUSH_RETRIES} after ${delay}ms`);
			await new Promise((r) => setTimeout(r, delay));
			req.index = this.index++;
		}
		return void 0;
	}
	/** Check if an error is a rate-limit error (QQ err_code 50002 or HTTP 429). */
	isRateLimitError(err) {
		const msg = err instanceof Error ? err.message : String(err);
		if (msg.includes("rate limit")) return true;
		const code = err?.code ?? err?.err_code;
		if (code === 50002 || code === 429) return true;
		return false;
	}
};

//#endregion
//#region node_modules/@tencent-connect/qqbot-nodejs/dist/QQBot.js
/** QQ Open Platform message type codes (msg_type). */
const MsgType = {
	TEXT: 0,
	MARKDOWN: 2,
	ARK: 3,
	EMBED: 4,
	MEDIA: 7
};
const noopLogger = {
	info: () => {},
	error: () => {},
	warn: () => {},
	debug: () => {}
};
/**
* High-level QQ Open Platform client.
*
* Owns an isolated stack of low-level primitives (token manager, HTTP
* client, message API, media APIs, gateway connection) per bot instance,
* so multiple bots can run concurrently without sharing global state.
*/
var QQBot = class {
	tokenManager;
	apiClient;
	messageApi;
	mediaApi;
	chunkedMediaApi;
	opts;
	logger;
	creds;
	account;
	userAgent;
	uploadCache;
	middlewares = [];
	handlers = {
		ready: new Set(),
		resumed: new Set(),
		error: new Set(),
		message: new Set(),
		interaction: new Set(),
		rawEvent: new Set()
	};
	gateway = null;
	abortController = null;
	_apiGateway = null;
	constructor(options) {
		if (!options.appId) throw new Error("QQBot: appId is required");
		if (!options.appSecret) throw new Error("QQBot: appSecret is required");
		this.opts = options;
		this.logger = options.logger ?? noopLogger;
		this.userAgent = options.userAgent ?? `qqbot-nodejs/0.1.0 (Node/${process.versions.node})`;
		this.creds = {
			appId: options.appId,
			clientSecret: options.appSecret
		};
		this.account = {
			accountId: options.accountId ?? options.appId,
			appId: options.appId,
			clientSecret: options.appSecret,
			markdownSupport: options.markdownSupport === true
		};
		this.uploadCache = options.uploadCache ?? new UploadCache({ logger: this.logger });
		this.apiClient = new ApiClient({
			logger: this.logger,
			userAgent: this.userAgent,
			baseUrl: options.baseUrl
		});
		this.tokenManager = new TokenManager({
			logger: this.logger,
			userAgent: this.userAgent,
			baseUrl: options.tokenBaseUrl
		});
		this.messageApi = new MessageApi(this.apiClient, this.tokenManager, {
			markdownSupport: options.markdownSupport === true,
			logger: this.logger
		});
		const cacheAdapter = {
			computeHash: (data) => this.uploadCache.computeHash(data),
			get: (hash, scope, targetId, fileType) => this.uploadCache.get(hash, scope, targetId, fileType),
			set: (hash, scope, targetId, fileType, fileInfo, fileUuid, ttl) => this.uploadCache.set(hash, scope, targetId, fileType, fileInfo, fileUuid, ttl)
		};
		this.mediaApi = new MediaApi(this.apiClient, this.tokenManager, {
			logger: this.logger,
			uploadCache: cacheAdapter,
			sanitizeFileName
		});
		this.chunkedMediaApi = new ChunkedMediaApi(this.apiClient, this.tokenManager, {
			logger: this.logger,
			uploadCache: cacheAdapter,
			sanitizeFileName
		});
	}
	/** The QQ Open Platform AppID this bot is bound to. */
	get appId() {
		return this.creds.appId;
	}
	/** The stable account id (defaults to appId). */
	get accountId() {
		return this.account.accountId;
	}
	on(event, handler) {
		this.handlers[event].add(handler);
		return this;
	}
	off(event, handler) {
		this.handlers[event].delete(handler);
		return this;
	}
	/**
	* Register an inbound middleware. Middlewares run in registration order
	* before the `message` event listeners; calling `ctx.stop()` (or simply
	* not calling `next()`) short-circuits the chain — including the final
	* `message` listener.
	*
	* @example
	* ```ts
	* import { accessPolicy, mentionGate } from "@tencent-connect/qqbot-nodejs";
	* bot.use(accessPolicy({ group: { mode: "allowlist", allow: [...] } }));
	* bot.use(mentionGate());
	* bot.on("message", async (ctx, msg) => {  ... });
	* ```
	*/
	use(...middleware) {
		for (const mw of middleware) {
			if (typeof mw !== "function") throw new Error("QQBot.use: middleware must be a function");
			this.middlewares.push(mw);
		}
		return this;
	}
	/** Read the registered middleware chain (for diagnostics). */
	getMiddlewares() {
		return this.middlewares;
	}
	async emit(event, ...args) {
		for (const handler of this.handlers[event]) try {
			await Promise.resolve(handler(...args));
		} catch (err) {
			this.logger.error?.(`[qqbot] handler for "${String(event)}" threw: ${err instanceof Error ? err.message : String(err)}`);
		}
	}
	/**
	* Start receiving events from QQ Open Platform.
	*
	* - **WebSocket mode** (default): connects to the WS gateway with heartbeat/RESUME.
	* - **Webhook mode**: starts an HTTP server to receive POST callbacks.
	*
	* Resolves when {@link stop} or the abort signal terminates the connection.
	*/
	async start(externalSignal) {
		if (this.gateway) throw new Error("QQBot: already started");
		this.abortController = new AbortController();
		if (externalSignal) if (externalSignal.aborted) this.abortController.abort();
		else externalSignal.addEventListener("abort", () => this.abortController?.abort(), { once: true });
		const transportMode = this.opts.transport ?? "websocket";
		if (transportMode === "webhook") await this.startWebhook();
		else if (transportMode === "websocket") await this.startWebSocket();
		else {
			const custom = transportMode;
			await custom.start();
		}
		this.tokenManager.stopBackgroundRefresh(this.creds.appId);
		this.gateway = null;
		this.abortController = null;
	}
	/** Stop the transport and background refreshers. */
	stop() {
		this.abortController?.abort();
		this.tokenManager.stopBackgroundRefresh(this.creds.appId);
		this.gateway = null;
		this.abortController = null;
	}
	/**
	* Initialize token based on the configured prefetch strategy.
	*
	* - `"sync"` (default): awaits the first token fetch, providing fail-fast
	*   semantics so credential errors surface at startup.
	* - `"async"`: fires the token fetch in the background and starts the
	*   background refresher immediately — trades fail-fast for faster startup.
	*/
	async initToken() {
		const mode = this.opts.tokenPrefetch ?? "sync";
		if (mode === "sync") await this.tokenManager.getAccessToken(this.creds.appId, this.creds.clientSecret);
		else this.tokenManager.getAccessToken(this.creds.appId, this.creds.clientSecret).catch((err) => {
			this.logger.error?.(`[qqbot] async token prefetch failed: ${err}`);
			this.emit("error", err instanceof Error ? err : new Error(String(err)));
		});
		this.tokenManager.startBackgroundRefresh(this.creds.appId, this.creds.clientSecret);
	}
	async startWebSocket() {
		await this.initToken();
		this.gateway = new GatewayConnection({
			account: this.account,
			abortSignal: this.abortController.signal,
			log: this.logger,
			userAgent: this.userAgent,
			intents: this.opts.intents,
			session: this.opts.sessionPersistence,
			getAccessToken: () => this.tokenManager.getAccessToken(this.creds.appId, this.creds.clientSecret),
			clearTokenCache: () => this.tokenManager.clearCache(this.creds.appId),
			getGatewayUrl: () => this.messageApi.getGatewayUrl(this.creds),
			onReady: (data) => {
				this.logger.info?.(`[qqbot] gateway READY`);
				this.emit("ready", data);
			},
			onResumed: (data) => {
				this.logger.info?.(`[qqbot] gateway RESUMED`);
				this.emit("resumed", data);
			},
			onError: (err) => {
				this.emit("error", err);
			},
			onMessage: (raw) => this.handleInboundMessage(raw),
			onInteraction: (event) => {
				const ctx = {
					bot: this,
					event,
					state: {},
					receivedAt: Date.now()
				};
				this.emit("interaction", ctx, event);
			},
			onRawEvent: (type, data) => {
				const ctx = {
					bot: this,
					eventType: type,
					data,
					state: {},
					receivedAt: Date.now()
				};
				this.emit("rawEvent", ctx);
			}
		});
		await this.gateway.start();
	}
	async startWebhook() {
		await this.initToken();
		const webhook = new WebhookTransport({
			appId: this.creds.appId,
			appSecret: this.creds.clientSecret,
			port: this.opts.webhook?.port,
			path: this.opts.webhook?.path,
			server: this.opts.webhook?.server,
			accountId: this.account.accountId,
			log: this.logger,
			abortSignal: this.abortController.signal
		}, {
			onReady: (data) => {
				this.logger.info?.(`[qqbot] webhook READY`);
				this.emit("ready", data);
			},
			onResumed: (data) => {
				this.emit("resumed", data);
			},
			onError: (err) => {
				this.emit("error", err);
			},
			onMessage: (raw) => this.handleInboundMessage(raw),
			onInteraction: (event) => {
				const ctx = {
					bot: this,
					event,
					state: {},
					receivedAt: Date.now()
				};
				this.emit("interaction", ctx, event);
			}
		});
		await webhook.start();
	}
	async handleInboundMessage(raw) {
		const replyTarget = this.deriveReplyTarget(raw);
		if (!replyTarget) {
			this.logger.debug?.(`[qqbot] inbound message has no reply target — skipping`);
			return;
		}
		const augmented = {
			...raw,
			replyTarget
		};
		const ctx = createMiddlewareContext({
			bot: this,
			message: augmented,
			log: this.logger
		});
		const downstream = async () => {
			await this.emit("message", ctx, ctx.message);
		};
		const chain = [...this.middlewares, downstream];
		try {
			await runMiddlewareChain(chain, ctx);
		} catch (err) {
			this.logger.error?.(`[qqbot] middleware chain threw: ${err instanceof Error ? err.message : String(err)}`);
			this.emit("error", err instanceof Error ? err : new Error(String(err)));
		}
	}
	/**
	* Universal message send — supports all QQ Open Platform message types.
	*
	* This is the most flexible sending method. It accepts the full parameter
	* set of POST `/v2/users/{openid}/messages` or `/v2/groups/{group_openid}/messages`.
	* Use it when the convenience helpers (sendText, sendMarkdown, etc.) don't
	* cover your use case.
	*
	* `msg_type` is auto-detected if not specified:
	* - markdown field present → 2 (Markdown)
	* - ark field present → 3 (Ark)
	* - embed field present → 4 (Embed)
	* - media field present → 7 (Rich media)
	* - otherwise → 0 (Text)
	*
	* @example Send a keyboard message
	* ```ts
	* await bot.send({
	*   target: msg.replyTarget,
	*   msgType: MsgType.MARKDOWN,
	*   markdown: { content: '# Hello' },
	*   keyboard: { content: { rows: [...] } },
	* });
	* ```
	*
	* @example Send a proactive message (no msgId)
	* ```ts
	* await bot.send({
	*   target: { scope: 'c2c', targetId: openid },
	*   content: 'Hello from bot!',
	* });
	* ```
	*/
	async send(opts) {
		const body = {};
		if (opts.target.msgId) body.msg_id = opts.target.msgId;
		if (opts.msgType !== void 0) body.msg_type = opts.msgType;
		if (opts.content !== void 0) body.content = opts.content;
		if (opts.markdown) body.markdown = opts.markdown;
		if (opts.ark) body.ark = opts.ark;
		if (opts.embed) body.embed = opts.embed;
		if (opts.media) body.media = opts.media;
		if (opts.keyboard) body.keyboard = opts.keyboard;
		if (opts.messageReference) body.message_reference = opts.messageReference;
		if (opts.extra) Object.assign(body, opts.extra);
		return this.messageApi.sendRaw(opts.target.scope, opts.target.targetId, this.creds, body);
	}
	/**
	* Send a text message to a C2C user or group (smart mode).
	*
	* **Difference from `send()`**:
	* - `sendText` auto-selects msg_type based on `markdownSupport` config
	*   (markdown bots automatically send as msg_type=2).
	* - `send()` is explicit mode — you control msg_type directly.
	*
	* When `target.msgId` is present the message is treated as a reply
	* (tied to the inbound message lifecycle); otherwise it is treated as
	* a proactive push.
	*/
	async sendText(target, content) {
		if (target.msgId) return this.messageApi.sendMessage(target.scope, target.targetId, content, this.creds, { msgId: target.msgId });
		return this.messageApi.sendProactiveMessage(target.scope, target.targetId, content, this.creds);
	}
	/** Send a text message with an inline keyboard. */
	async sendTextWithKeyboard(target, content, inlineKeyboard) {
		return this.messageApi.sendMessage(target.scope, target.targetId, content, this.creds, {
			msgId: target.msgId,
			inlineKeyboard
		});
	}
	/**
	* Send a Markdown message (msg_type=2).
	*
	* @example
	* ```ts
	* await bot.sendMarkdown(msg.replyTarget, '# Hello **world**');
	* await bot.sendMarkdown(msg.replyTarget, '# Click below', {
	*   keyboard: { content: { rows: [...] } },
	* });
	* ```
	*/
	async sendMarkdown(target, content, opts) {
		return this.send({
			target,
			msgType: MsgType.MARKDOWN,
			markdown: { content },
			keyboard: opts?.keyboard
		});
	}
	/**
	* Recall (delete) a previously sent message.
	*
	* @example
	* ```ts
	* const sent = await bot.sendText(target, 'oops');
	* await bot.recallMessage(target, sent.id);
	* ```
	*/
	async recallMessage(target, messageId) {
		return this.messageApi.recallMessage(target.scope, target.targetId, messageId, this.creds);
	}
	/**
	* Send a wakeup/recall message (C2C only, 30-day window).
	*
	* After a user initiates a conversation, the bot can send periodic
	* recall messages within 30 days using `is_wakeup: true`.
	* Platform enforces frequency limits.
	*
	* @example
	* ```ts
	* await bot.sendWakeup({ scope: 'c2c', targetId: openid }, '你有新消息!');
	* ```
	*/
	async sendWakeup(target, content) {
		if (target.scope !== "c2c") throw new Error("sendWakeup is only supported for C2C targets");
		return this.send({
			target,
			content,
			extra: { is_wakeup: true }
		});
	}
	/**
	* Send a message to a guild text channel.
	*
	* @example
	* ```ts
	* await bot.sendChannelMessage(channelId, '频道消息', { msgId });
	* ```
	*/
	async sendChannelMessage(channelId, content, opts) {
		const body = { content };
		if (opts?.msgId) body.msg_id = opts.msgId;
		if (opts?.keyboard) body.keyboard = opts.keyboard;
		if (opts?.messageReference) body.message_reference = { message_id: opts.messageReference };
		return this.messageApi.sendChannelMessageRaw(channelId, this.creds, body);
	}
	/**
	* Send a direct message (DM) in a guild.
	*
	* @example
	* ```ts
	* await bot.sendDmMessage(guildId, '私信内容', { msgId });
	* ```
	*/
	async sendDmMessage(guildId, content, opts) {
		const body = { content };
		if (opts?.msgId) body.msg_id = opts.msgId;
		return this.messageApi.sendDmMessageRaw(guildId, this.creds, body);
	}
	/** Send a typing indicator (C2C only). */
	async sendTyping(target, durationSec = 30) {
		if (target.scope !== "c2c") throw new Error("sendTyping is only supported for C2C targets");
		return this.messageApi.sendInputNotify({
			openid: target.targetId,
			creds: this.creds,
			msgId: target.msgId,
			inputSecond: durationSec
		});
	}
	/** Acknowledge an INTERACTION_CREATE event. */
	async acknowledgeInteraction(interactionId, code = 0, data) {
		return this.messageApi.acknowledgeInteraction(interactionId, this.creds, code, data);
	}
	/**
	* Open Platform API Gateway — call any QQ Open Platform REST API with
	* automatic token injection and refresh.
	*
	* This is the "escape hatch" for any API not wrapped by a dedicated method.
	* All requests are authenticated, rate-limit aware, and return structured errors.
	*
	* @example List guilds
	* ```ts
	* const guilds = await bot.api.get('/users/@me/guilds');
	* ```
	*
	* @example Create an announcement
	* ```ts
	* await bot.api.post(`/guilds/${guildId}/announces`, {
	*   message_id: msgId, channel_id: channelId,
	* });
	* ```
	*
	* @example Get a raw access token
	* ```ts
	* const token = await bot.api.getToken();
	* ```
	*/
	get api() {
		if (this._apiGateway) return this._apiGateway;
		this._apiGateway = {
			get: (path$1, query) => this.apiRequest("GET", path$1, void 0, query),
			post: (path$1, body) => this.apiRequest("POST", path$1, body),
			put: (path$1, body) => this.apiRequest("PUT", path$1, body),
			patch: (path$1, body) => this.apiRequest("PATCH", path$1, body),
			delete: (path$1) => this.apiRequest("DELETE", path$1),
			getToken: () => this.tokenManager.getAccessToken(this.creds.appId, this.creds.clientSecret)
		};
		return this._apiGateway;
	}
	async apiRequest(method, path$1, body, query) {
		const token = await this.tokenManager.getAccessToken(this.creds.appId, this.creds.clientSecret);
		let fullPath = path$1;
		if (query && Object.keys(query).length > 0) {
			const params = new URLSearchParams();
			for (const [k, v] of Object.entries(query)) if (v !== void 0 && v !== null) params.set(k, String(v));
			fullPath = `${path$1}?${params.toString()}`;
		}
		return this.apiClient.request(token, method, fullPath, body ?? void 0);
	}
	/**
	* Open a C2C stream session for incremental output.
	*
	* @returns A {@link StreamSession} — call `update(fullText)` repeatedly,
	* then `complete()` when finished.
	*/
	openStream(opts) {
		if (opts.target.scope !== "c2c") throw new Error("Streaming is only supported for C2C targets");
		if (!opts.target.msgId) throw new Error("Streaming requires target.msgId from the inbound message");
		const sessionOptions = {
			openid: opts.target.targetId,
			msgId: opts.target.msgId,
			creds: this.creds,
			eventId: opts.eventId,
			throttleMs: opts.throttleMs,
			logger: this.logger
		};
		return new StreamSession(this.messageApi, sessionOptions);
	}
	/**
	* Upload media (image / voice / video / file) to a target. Automatically
	* dispatches to the chunked-upload path when the source exceeds
	* {@link LARGE_FILE_THRESHOLD} bytes.
	*/
	async uploadMedia(opts) {
		const sources = [
			opts.url,
			opts.fileData,
			opts.buffer,
			opts.localPath
		].filter((v) => v !== void 0);
		if (sources.length === 0) throw new Error("uploadMedia: one of url/fileData/buffer/localPath is required");
		if (sources.length > 1) throw new Error("uploadMedia: provide exactly one source");
		const size = await this.computeSourceSize(opts);
		const useChunked = size !== null && size >= LARGE_FILE_THRESHOLD;
		const fileName = opts.fileName ?? (opts.localPath ? path.basename(opts.localPath) : void 0) ?? (opts.url ? decodeURIComponent(path.basename(new URL(opts.url).pathname)) || void 0 : void 0);
		if (useChunked && (opts.localPath || opts.buffer)) {
			const source = opts.localPath ? {
				kind: "localPath",
				path: opts.localPath,
				size
			} : {
				kind: "buffer",
				buffer: opts.buffer,
				fileName
			};
			return this.chunkedMediaApi.uploadChunked({
				scope: opts.target.scope,
				targetId: opts.target.targetId,
				fileType: opts.fileType,
				source,
				creds: this.creds,
				fileName,
				onProgress: opts.onProgress ? (p) => opts.onProgress(p.uploadedBytes, p.totalBytes) : void 0
			});
		}
		return this.mediaApi.uploadMedia(opts.target.scope, opts.target.targetId, opts.fileType, this.creds, {
			url: opts.url,
			fileData: opts.fileData,
			buffer: opts.buffer,
			localPath: opts.localPath,
			srvSendMsg: opts.srvSendMsg,
			fileName
		});
	}
	/**
	* Upload + send a media message to a C2C user or group.
	*/
	async sendMedia(opts) {
		const upload = await this.uploadMedia({
			...opts,
			srvSendMsg: false
		});
		const message = await this.mediaApi.sendMediaMessage(opts.target.scope, opts.target.targetId, upload.file_info, this.creds, {
			msgId: opts.target.msgId,
			content: opts.content
		});
		return {
			upload,
			message
		};
	}
	/** Convenience: upload + send an image. */
	async sendImage(target, source, opts) {
		return this.sendMedia({
			target,
			fileType: MediaFileType.IMAGE,
			...source,
			content: opts?.content,
			onProgress: opts?.onProgress
		});
	}
	/** Convenience: upload + send a video. */
	async sendVideo(target, source, opts) {
		return this.sendMedia({
			target,
			fileType: MediaFileType.VIDEO,
			...source,
			content: opts?.content,
			onProgress: opts?.onProgress
		});
	}
	/** Convenience: upload + send a voice message. */
	async sendVoice(target, source, opts) {
		return this.sendMedia({
			target,
			fileType: MediaFileType.VOICE,
			...source,
			onProgress: opts?.onProgress
		});
	}
	/** Convenience: upload + send a generic file (for users with file-message permission). */
	async sendFile(target, source, opts) {
		return this.sendMedia({
			target,
			fileType: MediaFileType.FILE,
			...source,
			fileName: opts?.fileName,
			content: opts?.content,
			onProgress: opts?.onProgress
		});
	}
	deriveReplyTarget(raw) {
		if (raw.kind === "c2c") return {
			scope: "c2c",
			targetId: raw.senderId,
			msgId: raw.messageId
		};
		if (raw.kind === "group" && raw.groupOpenid) return {
			scope: "group",
			targetId: raw.groupOpenid,
			msgId: raw.messageId
		};
		return null;
	}
	async computeSourceSize(opts) {
		if (opts.buffer) return opts.buffer.length;
		if (opts.localPath) try {
			const stat = await fs.promises.stat(opts.localPath);
			return stat.size;
		} catch {
			return null;
		}
		if (opts.fileData) return Math.floor(opts.fileData.length * 3 / 4);
		return null;
	}
};

//#endregion
export { QQBot };