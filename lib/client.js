window.__ModuleLoader__.load({ id: "dsh-shiningweb-ui", factory: (require) => {
"use strict";
var module = { exports: {} }; var exports = module.exports;
//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

//#endregion
const react = __toESM(require("react"));
const react_jsx_runtime = __toESM(require("react/jsx-runtime"));

//#region src/settings.ts
/**
* dsh-shiningweb-ui 设置类型与默认值（host/client 共享，不含 schemastery）。
* 此模块**不** import schemastery（那是宿主侧 schema 的事，见 settings-schema.ts）：
* client bundle 会打包它，而 client 只需类型+默认值，不需要 schema。
*/
const SETTINGS_NAMESPACE = "shining";
/** schema 校验通过的默认值。 */
const DEFAULT_SHINING_SETTINGS = {
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
		personaPrompt: "你是天圆地方，一位温柔而能干的助理。请用简洁、亲切的中文回答。"
	}
};

//#endregion
//#region src/client/locales.ts
/** dsh-shiningweb-ui client 字典。 */
const NS = "shining";
const dict = {
	zh: {
		entryChat: "天圆地方",
		entryFiles: "文件",
		settingsTitle: "璀璨星河",
		chatTitle: "天圆地方",
		send: "发送",
		sendPlaceholder: "输入消息…",
		close: "关闭",
		fileFilter: "过滤文件…",
		newFile: "新建文件",
		newDir: "新建文件夹",
		rename: "重命名",
		remove: "删除",
		copyPath: "复制路径",
		dirtyCount: "未提交",
		refresh: "刷新"
	},
	en: {
		entryChat: "Tianyuan Difang",
		entryFiles: "Files",
		settingsTitle: "Shining Web",
		chatTitle: "Tianyuan Difang",
		send: "Send",
		sendPlaceholder: "Type a message…",
		close: "Close",
		fileFilter: "Filter files…",
		newFile: "New File",
		newDir: "New Folder",
		rename: "Rename",
		remove: "Delete",
		copyPath: "Copy Path",
		dirtyCount: "Dirty",
		refresh: "Refresh"
	}
};

//#endregion
//#region src/client/settings.ts
let scope = null;
/** apply 时绑定 settingsScope。 */
function bindSettingsScope(s) {
	scope = s;
}
/**
* 深合并默认值：即使 scope 快照 value 是部分对象（`{}` 或子字段缺失），
* 也返回完整结构。否则组件读 settings.chat.model 会 undefined/崩溃，
* 表现为设置空字段 + 点不动。
*/
function mergeSettings(partial$1) {
	if (!partial$1) return { ...DEFAULT_SHINING_SETTINGS };
	return {
		enabled: partial$1.enabled ?? DEFAULT_SHINING_SETTINGS.enabled,
		capabilityMode: partial$1.capabilityMode ?? DEFAULT_SHINING_SETTINGS.capabilityMode,
		chat: {
			...DEFAULT_SHINING_SETTINGS.chat,
			...partial$1.chat ?? {}
		},
		fileExplorer: {
			...DEFAULT_SHINING_SETTINGS.fileExplorer,
			...partial$1.fileExplorer ?? {}
		},
		git: {
			...DEFAULT_SHINING_SETTINGS.git,
			...partial$1.git ?? {}
		},
		visual: {
			...DEFAULT_SHINING_SETTINGS.visual,
			...partial$1.visual ?? {}
		},
		qq: {
			...DEFAULT_SHINING_SETTINGS.qq,
			...partial$1.qq ?? {}
		}
	};
}
let lastSource;
let lastMerged;
function snapshot() {
	const value = scope?.getSnapshot().value;
	if (value === lastSource && lastMerged) return lastMerged;
	lastSource = value;
	lastMerged = mergeSettings(value);
	return lastMerged;
}
/** 读取当前设置（随 settingsScope 变化重渲染）。 */
function useSettings() {
	return (0, react.useSyncExternalStore)((l) => scope ? scope.subscribe(l) : () => {}, snapshot);
}
/** 写入一个设置字段（经绑定 scope）。 */
async function writeSetting(field, value) {
	await scope?.set(field, value);
}

//#endregion
//#region src/client/visual.ts
const THEME_COLORS = {
	"galaxy-blue": {
		primary: "#4f7cff",
		accent: "#7aa0ff",
		gradient: "linear-gradient(135deg, #4f7cff 0%, #7aa0ff 100%)",
		glow: "rgba(79, 124, 255, 0.35)",
		border: "rgba(79, 124, 255, 0.35)",
		soft: "rgba(79, 124, 255, 0.10)"
	},
	"dawn-gold": {
		primary: "#e0a43b",
		accent: "#f2c56b",
		gradient: "linear-gradient(135deg, #e0a43b 0%, #f2c56b 100%)",
		glow: "rgba(224, 164, 59, 0.35)",
		border: "rgba(224, 164, 59, 0.35)",
		soft: "rgba(224, 164, 59, 0.10)"
	},
	"aurora-purple": {
		primary: "#9a6bff",
		accent: "#c39bff",
		gradient: "linear-gradient(135deg, #9a6bff 0%, #c39bff 100%)",
		glow: "rgba(154, 107, 255, 0.35)",
		border: "rgba(154, 107, 255, 0.35)",
		soft: "rgba(154, 107, 255, 0.10)"
	}
};
/** 将设置投影到 CSS 变量（浏览器环境调用）。 */
function applyVisual(settings) {
	if (typeof document === "undefined") return;
	const root$1 = document.documentElement;
	const color = THEME_COLORS[settings?.visual.themeColor ?? "galaxy-blue"];
	root$1.style.setProperty("--shining-primary", color.primary);
	root$1.style.setProperty("--shining-accent", color.accent);
	root$1.style.setProperty("--shining-gradient", color.gradient);
	root$1.style.setProperty("--shining-glow", color.glow);
	root$1.style.setProperty("--shining-border", color.border);
	root$1.style.setProperty("--shining-soft", color.soft);
	root$1.style.setProperty("--shining-blur", `${settings?.visual.glassBlur ?? 12}px`);
}

//#endregion
//#region node_modules/zod/v4/core/core.js
var _a$1;
function $constructor(name, initializer$2, params) {
	function init(inst, def) {
		if (!inst._zod) Object.defineProperty(inst, "_zod", {
			value: {
				def,
				constr: _,
				traits: new Set()
			},
			enumerable: false
		});
		if (inst._zod.traits.has(name)) return;
		inst._zod.traits.add(name);
		initializer$2(inst, def);
		const proto = _.prototype;
		const keys = Object.keys(proto);
		for (let i = 0; i < keys.length; i++) {
			const k = keys[i];
			if (!(k in inst)) inst[k] = proto[k].bind(inst);
		}
	}
	const Parent = params?.Parent ?? Object;
	class Definition extends Parent {}
	Object.defineProperty(Definition, "name", { value: name });
	function _(def) {
		var _a$2;
		const inst = params?.Parent ? new Definition() : this;
		init(inst, def);
		(_a$2 = inst._zod).deferred ?? (_a$2.deferred = []);
		for (const fn of inst._zod.deferred) fn();
		return inst;
	}
	Object.defineProperty(_, "init", { value: init });
	Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
		if (params?.Parent && inst instanceof params.Parent) return true;
		return inst?._zod?.traits?.has(name);
	} });
	Object.defineProperty(_, "name", { value: name });
	return _;
}
const $brand = Symbol("zod_brand");
var $ZodAsyncError = class extends Error {
	constructor() {
		super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
	}
};
var $ZodEncodeError = class extends Error {
	constructor(name) {
		super(`Encountered unidirectional transform during encode: ${name}`);
		this.name = "ZodEncodeError";
	}
};
(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
const globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
	if (newConfig) Object.assign(globalConfig, newConfig);
	return globalConfig;
}

//#endregion
//#region node_modules/zod/v4/core/util.js
function getEnumValues(entries) {
	const numericValues = Object.values(entries).filter((v) => typeof v === "number");
	const values = Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
	return values;
}
function jsonStringifyReplacer(_, value) {
	if (typeof value === "bigint") return value.toString();
	return value;
}
function cached$1(getter) {
	const set$1 = false;
	return { get value() {
		if (!set$1) {
			const value = getter();
			Object.defineProperty(this, "value", { value });
			return value;
		}
		throw new Error("cached value already set");
	} };
}
function nullish(input) {
	return input === null || input === void 0;
}
function cleanRegex(source) {
	const start = source.startsWith("^") ? 1 : 0;
	const end = source.endsWith("$") ? source.length - 1 : source.length;
	return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
	const ratio = val / step;
	const roundedRatio = Math.round(ratio);
	const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
	if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
	return ratio - roundedRatio;
}
const EVALUATING = /* @__PURE__ */ Symbol("evaluating");
function defineLazy(object$1, key, getter) {
	let value = void 0;
	Object.defineProperty(object$1, key, {
		get() {
			if (value === EVALUATING) return void 0;
			if (value === void 0) {
				value = EVALUATING;
				value = getter();
			}
			return value;
		},
		set(v) {
			Object.defineProperty(object$1, key, { value: v });
		},
		configurable: true
	});
}
function assignProp(target, prop, value) {
	Object.defineProperty(target, prop, {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
}
function mergeDefs(...defs) {
	const mergedDescriptors = {};
	for (const def of defs) {
		const descriptors = Object.getOwnPropertyDescriptors(def);
		Object.assign(mergedDescriptors, descriptors);
	}
	return Object.defineProperties({}, mergedDescriptors);
}
function esc(str) {
	return JSON.stringify(str);
}
function slugify(input) {
	return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject(data) {
	return typeof data === "object" && data !== null && !Array.isArray(data);
}
const allowsEval = /* @__PURE__ */ cached$1(() => {
	if (globalConfig.jitless) return false;
	if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
	try {
		const F = Function;
		new F("");
		return true;
	} catch (_) {
		return false;
	}
});
function isPlainObject(o) {
	if (isObject(o) === false) return false;
	const ctor = o.constructor;
	if (ctor === void 0) return true;
	if (typeof ctor !== "function") return true;
	const prot = ctor.prototype;
	if (isObject(prot) === false) return false;
	if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
	return true;
}
function shallowClone(o) {
	if (isPlainObject(o)) return { ...o };
	if (Array.isArray(o)) return [...o];
	if (o instanceof Map) return new Map(o);
	if (o instanceof Set) return new Set(o);
	return o;
}
const propertyKeyTypes = /* @__PURE__ */ new Set([
	"string",
	"number",
	"symbol"
]);
function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
	const cl = new inst._zod.constr(def ?? inst._zod.def);
	if (!def || params?.parent) cl._zod.parent = inst;
	return cl;
}
function normalizeParams(_params) {
	const params = _params;
	if (!params) return {};
	if (typeof params === "string") return { error: () => params };
	if (params?.message !== void 0) {
		if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
		params.error = params.message;
	}
	delete params.message;
	if (typeof params.error === "string") return {
		...params,
		error: () => params.error
	};
	return params;
}
function optionalKeys(shape) {
	return Object.keys(shape).filter((k) => {
		return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
	});
}
const NUMBER_FORMAT_RANGES = {
	safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
function pick(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	const hasChecks = checks && checks.length > 0;
	if (hasChecks) throw new Error(".pick() cannot be used on object schemas containing refinements");
	const def = mergeDefs(schema._zod.def, {
		get shape() {
			const newShape = {};
			for (const key in mask) {
				if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				newShape[key] = currDef.shape[key];
			}
			assignProp(this, "shape", newShape);
			return newShape;
		},
		checks: []
	});
	return clone(schema, def);
}
function omit(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	const hasChecks = checks && checks.length > 0;
	if (hasChecks) throw new Error(".omit() cannot be used on object schemas containing refinements");
	const def = mergeDefs(schema._zod.def, {
		get shape() {
			const newShape = { ...schema._zod.def.shape };
			for (const key in mask) {
				if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				delete newShape[key];
			}
			assignProp(this, "shape", newShape);
			return newShape;
		},
		checks: []
	});
	return clone(schema, def);
}
function extend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
	const checks = schema._zod.def.checks;
	const hasChecks = checks && checks.length > 0;
	if (hasChecks) {
		const existingShape = schema._zod.def.shape;
		for (const key in shape) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	const def = mergeDefs(schema._zod.def, { get shape() {
		const _shape = {
			...schema._zod.def.shape,
			...shape
		};
		assignProp(this, "shape", _shape);
		return _shape;
	} });
	return clone(schema, def);
}
function safeExtend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
	const def = mergeDefs(schema._zod.def, { get shape() {
		const _shape = {
			...schema._zod.def.shape,
			...shape
		};
		assignProp(this, "shape", _shape);
		return _shape;
	} });
	return clone(schema, def);
}
function merge(a, b) {
	if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
	const def = mergeDefs(a._zod.def, {
		get shape() {
			const _shape = {
				...a._zod.def.shape,
				...b._zod.def.shape
			};
			assignProp(this, "shape", _shape);
			return _shape;
		},
		get catchall() {
			return b._zod.def.catchall;
		},
		checks: b._zod.def.checks ?? []
	});
	return clone(a, def);
}
function partial(Class, schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	const hasChecks = checks && checks.length > 0;
	if (hasChecks) throw new Error(".partial() cannot be used on object schemas containing refinements");
	const def = mergeDefs(schema._zod.def, {
		get shape() {
			const oldShape = schema._zod.def.shape;
			const shape = { ...oldShape };
			if (mask) for (const key in mask) {
				if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				shape[key] = Class ? new Class({
					type: "optional",
					innerType: oldShape[key]
				}) : oldShape[key];
			}
			else for (const key in oldShape) shape[key] = Class ? new Class({
				type: "optional",
				innerType: oldShape[key]
			}) : oldShape[key];
			assignProp(this, "shape", shape);
			return shape;
		},
		checks: []
	});
	return clone(schema, def);
}
function required(Class, schema, mask) {
	const def = mergeDefs(schema._zod.def, { get shape() {
		const oldShape = schema._zod.def.shape;
		const shape = { ...oldShape };
		if (mask) for (const key in mask) {
			if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
			if (!mask[key]) continue;
			shape[key] = new Class({
				type: "nonoptional",
				innerType: oldShape[key]
			});
		}
		else for (const key in oldShape) shape[key] = new Class({
			type: "nonoptional",
			innerType: oldShape[key]
		});
		assignProp(this, "shape", shape);
		return shape;
	} });
	return clone(schema, def);
}
function aborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
	return false;
}
function explicitlyAborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
	return false;
}
function prefixIssues(path, issues) {
	return issues.map((iss) => {
		var _a$2;
		(_a$2 = iss).path ?? (_a$2.path = []);
		iss.path.unshift(path);
		return iss;
	});
}
function unwrapMessage(message) {
	return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx$1, config$1) {
	const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx$1?.error?.(iss)) ?? unwrapMessage(config$1.customError?.(iss)) ?? unwrapMessage(config$1.localeError?.(iss)) ?? "Invalid input";
	const { inst: _inst, continue: _continue, input: _input,...rest } = iss;
	rest.path ?? (rest.path = []);
	rest.message = message;
	if (ctx$1?.reportInput) rest.input = _input;
	return rest;
}
function getLengthableOrigin(input) {
	if (Array.isArray(input)) return "array";
	if (typeof input === "string") return "string";
	return "unknown";
}
function issue(...args) {
	const [iss, input, inst] = args;
	if (typeof iss === "string") return {
		message: iss,
		code: "custom",
		input,
		inst
	};
	return { ...iss };
}

//#endregion
//#region node_modules/zod/v4/core/errors.js
const initializer$1 = (inst, def) => {
	inst.name = "$ZodError";
	Object.defineProperty(inst, "_zod", {
		value: inst._zod,
		enumerable: false
	});
	Object.defineProperty(inst, "issues", {
		value: def,
		enumerable: false
	});
	inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
	Object.defineProperty(inst, "toString", {
		value: () => inst.message,
		enumerable: false
	});
};
const $ZodError = $constructor("$ZodError", initializer$1);
const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
function flattenError(error, mapper = (issue$1) => issue$1.message) {
	const fieldErrors = {};
	const formErrors = [];
	for (const sub of error.issues) if (sub.path.length > 0) {
		fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
		fieldErrors[sub.path[0]].push(mapper(sub));
	} else formErrors.push(mapper(sub));
	return {
		formErrors,
		fieldErrors
	};
}
function formatError(error, mapper = (issue$1) => issue$1.message) {
	const fieldErrors = { _errors: [] };
	const processError = (error$1, path = []) => {
		for (const issue$1 of error$1.issues) if (issue$1.code === "invalid_union" && issue$1.errors.length) issue$1.errors.map((issues) => processError({ issues }, [...path, ...issue$1.path]));
		else if (issue$1.code === "invalid_key") processError({ issues: issue$1.issues }, [...path, ...issue$1.path]);
		else if (issue$1.code === "invalid_element") processError({ issues: issue$1.issues }, [...path, ...issue$1.path]);
		else {
			const fullpath = [...path, ...issue$1.path];
			if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue$1));
			else {
				let curr = fieldErrors;
				let i = 0;
				while (i < fullpath.length) {
					const el = fullpath[i];
					const terminal = i === fullpath.length - 1;
					if (!terminal) curr[el] = curr[el] || { _errors: [] };
					else {
						curr[el] = curr[el] || { _errors: [] };
						curr[el]._errors.push(mapper(issue$1));
					}
					curr = curr[el];
					i++;
				}
			}
		}
	};
	processError(error);
	return fieldErrors;
}

//#endregion
//#region node_modules/zod/v4/core/parse.js
const _parse = (_Err) => (schema, value, _ctx, _params) => {
	const ctx$1 = _ctx ? {
		..._ctx,
		async: false
	} : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx$1);
	if (result instanceof Promise) throw new $ZodAsyncError();
	if (result.issues.length) {
		const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx$1, config())));
		captureStackTrace(e, _params?.callee);
		throw e;
	}
	return result.value;
};
const parse$1 = /* @__PURE__ */ _parse($ZodRealError);
const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
	const ctx$1 = _ctx ? {
		..._ctx,
		async: true
	} : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx$1);
	if (result instanceof Promise) result = await result;
	if (result.issues.length) {
		const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx$1, config())));
		captureStackTrace(e, params?.callee);
		throw e;
	}
	return result.value;
};
const parseAsync$1 = /* @__PURE__ */ _parseAsync($ZodRealError);
const _safeParse = (_Err) => (schema, value, _ctx) => {
	const ctx$1 = _ctx ? {
		..._ctx,
		async: false
	} : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx$1);
	if (result instanceof Promise) throw new $ZodAsyncError();
	return result.issues.length ? {
		success: false,
		error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx$1, config())))
	} : {
		success: true,
		data: result.value
	};
};
const safeParse$1 = /* @__PURE__ */ _safeParse($ZodRealError);
const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx$1 = _ctx ? {
		..._ctx,
		async: true
	} : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx$1);
	if (result instanceof Promise) result = await result;
	return result.issues.length ? {
		success: false,
		error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx$1, config())))
	} : {
		success: true,
		data: result.value
	};
};
const safeParseAsync$1 = /* @__PURE__ */ _safeParseAsync($ZodRealError);
const _encode = (_Err) => (schema, value, _ctx) => {
	const ctx$1 = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _parse(_Err)(schema, value, ctx$1);
};
const encode$1 = /* @__PURE__ */ _encode($ZodRealError);
const _decode = (_Err) => (schema, value, _ctx) => {
	return _parse(_Err)(schema, value, _ctx);
};
const decode$1 = /* @__PURE__ */ _decode($ZodRealError);
const _encodeAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx$1 = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _parseAsync(_Err)(schema, value, ctx$1);
};
const encodeAsync$1 = /* @__PURE__ */ _encodeAsync($ZodRealError);
const _decodeAsync = (_Err) => async (schema, value, _ctx) => {
	return _parseAsync(_Err)(schema, value, _ctx);
};
const decodeAsync$1 = /* @__PURE__ */ _decodeAsync($ZodRealError);
const _safeEncode = (_Err) => (schema, value, _ctx) => {
	const ctx$1 = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _safeParse(_Err)(schema, value, ctx$1);
};
const safeEncode$1 = /* @__PURE__ */ _safeEncode($ZodRealError);
const _safeDecode = (_Err) => (schema, value, _ctx) => {
	return _safeParse(_Err)(schema, value, _ctx);
};
const safeDecode$1 = /* @__PURE__ */ _safeDecode($ZodRealError);
const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx$1 = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _safeParseAsync(_Err)(schema, value, ctx$1);
};
const safeEncodeAsync$1 = /* @__PURE__ */ _safeEncodeAsync($ZodRealError);
const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
	return _safeParseAsync(_Err)(schema, value, _ctx);
};
const safeDecodeAsync$1 = /* @__PURE__ */ _safeDecodeAsync($ZodRealError);

//#endregion
//#region node_modules/zod/v4/core/regexes.js
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link cuid2} instead.
* See https://github.com/paralleldrive/cuid.
*/
const cuid = /^[cC][0-9a-z]{6,}$/;
const cuid2 = /^[0-9a-z]+$/;
const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
const xid = /^[0-9a-vA-V]{20}$/;
const ksuid = /^[A-Za-z0-9]{27}$/;
const nanoid = /^[a-zA-Z0-9_-]{21}$/;
/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
/** Returns a regex for validating an RFC 9562/4122 UUID.
*
* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
const uuid = (version$2) => {
	if (!version$2) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
	return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version$2}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
/** Practical email validation */
const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji() {
	return new RegExp(_emoji$1, "u");
}
const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
const base64url = /^[A-Za-z0-9_-]*$/;
const httpProtocol = /^https?$/;
const e164 = /^\+[1-9]\d{6,14}$/;
const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
const date$1 = /* @__PURE__ */ new RegExp(`^${dateSource}$`);
function timeSource(args) {
	const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
	const regex = typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
	return regex;
}
function time$1(args) {
	return new RegExp(`^${timeSource(args)}$`);
}
function datetime$1(args) {
	const time$2 = timeSource({ precision: args.precision });
	const opts = ["Z"];
	if (args.local) opts.push("");
	if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
	const timeRegex = `${time$2}(?:${opts.join("|")})`;
	return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
const string$1 = (params) => {
	const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
	return new RegExp(`^${regex}$`);
};
const integer = /^-?\d+$/;
const number$1 = /^-?\d+(?:\.\d+)?$/;
const boolean$1 = /^(?:true|false)$/i;
const lowercase = /^[^A-Z]*$/;
const uppercase = /^[^a-z]*$/;

//#endregion
//#region node_modules/zod/v4/core/checks.js
const $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
	var _a$2;
	inst._zod ?? (inst._zod = {});
	inst._zod.def = def;
	(_a$2 = inst._zod).onattach ?? (_a$2.onattach = []);
});
const numericOriginMap = {
	number: "number",
	bigint: "bigint",
	object: "date"
};
const $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.onattach.push((inst$1) => {
		const bag = inst$1._zod.bag;
		const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
		if (def.value < curr) if (def.inclusive) bag.maximum = def.value;
		else bag.exclusiveMaximum = def.value;
	});
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
		payload.issues.push({
			origin,
			code: "too_big",
			maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.onattach.push((inst$1) => {
		const bag = inst$1._zod.bag;
		const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
		if (def.value > curr) if (def.inclusive) bag.minimum = def.value;
		else bag.exclusiveMinimum = def.value;
	});
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
		payload.issues.push({
			origin,
			code: "too_small",
			minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.onattach.push((inst$1) => {
		var _a$2;
		(_a$2 = inst$1._zod.bag).multipleOf ?? (_a$2.multipleOf = def.value);
	});
	inst._zod.check = (payload) => {
		if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
		const isMultiple = typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0;
		if (isMultiple) return;
		payload.issues.push({
			origin: typeof payload.value,
			code: "not_multiple_of",
			divisor: def.value,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
	$ZodCheck.init(inst, def);
	def.format = def.format || "float64";
	const isInt = def.format?.includes("int");
	const origin = isInt ? "int" : "number";
	const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
	inst._zod.onattach.push((inst$1) => {
		const bag = inst$1._zod.bag;
		bag.format = def.format;
		bag.minimum = minimum;
		bag.maximum = maximum;
		if (isInt) bag.pattern = integer;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (isInt) {
			if (!Number.isInteger(input)) {
				payload.issues.push({
					expected: origin,
					format: def.format,
					code: "invalid_type",
					continue: false,
					input,
					inst
				});
				return;
			}
			if (!Number.isSafeInteger(input)) {
				if (input > 0) payload.issues.push({
					input,
					code: "too_big",
					maximum: Number.MAX_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				else payload.issues.push({
					input,
					code: "too_small",
					minimum: Number.MIN_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				return;
			}
		}
		if (input < minimum) payload.issues.push({
			origin: "number",
			input,
			code: "too_small",
			minimum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
		if (input > maximum) payload.issues.push({
			origin: "number",
			input,
			code: "too_big",
			maximum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
	var _a$2;
	$ZodCheck.init(inst, def);
	(_a$2 = inst._zod.def).when ?? (_a$2.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst$1) => {
		const curr = inst$1._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
		if (def.maximum < curr) inst$1._zod.bag.maximum = def.maximum;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		const length = input.length;
		if (length <= def.maximum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_big",
			maximum: def.maximum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
	var _a$2;
	$ZodCheck.init(inst, def);
	(_a$2 = inst._zod.def).when ?? (_a$2.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst$1) => {
		const curr = inst$1._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
		if (def.minimum > curr) inst$1._zod.bag.minimum = def.minimum;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		const length = input.length;
		if (length >= def.minimum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_small",
			minimum: def.minimum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
	var _a$2;
	$ZodCheck.init(inst, def);
	(_a$2 = inst._zod.def).when ?? (_a$2.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst$1) => {
		const bag = inst$1._zod.bag;
		bag.minimum = def.length;
		bag.maximum = def.length;
		bag.length = def.length;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		const length = input.length;
		if (length === def.length) return;
		const origin = getLengthableOrigin(input);
		const tooBig = length > def.length;
		payload.issues.push({
			origin,
			...tooBig ? {
				code: "too_big",
				maximum: def.length
			} : {
				code: "too_small",
				minimum: def.length
			},
			inclusive: true,
			exact: true,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
	var _a$2, _b;
	$ZodCheck.init(inst, def);
	inst._zod.onattach.push((inst$1) => {
		const bag = inst$1._zod.bag;
		bag.format = def.format;
		if (def.pattern) {
			bag.patterns ?? (bag.patterns = new Set());
			bag.patterns.add(def.pattern);
		}
	});
	if (def.pattern) (_a$2 = inst._zod).check ?? (_a$2.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: def.format,
			input: payload.value,
			...def.pattern ? { pattern: def.pattern.toString() } : {},
			inst,
			continue: !def.abort
		});
	});
	else (_b = inst._zod).check ?? (_b.check = () => {});
});
const $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: payload.value,
			pattern: def.pattern.toString(),
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
	def.pattern ?? (def.pattern = lowercase);
	$ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
	def.pattern ?? (def.pattern = uppercase);
	$ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
	$ZodCheck.init(inst, def);
	const escapedRegex = escapeRegex(def.includes);
	const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
	def.pattern = pattern;
	inst._zod.onattach.push((inst$1) => {
		const bag = inst$1._zod.bag;
		bag.patterns ?? (bag.patterns = new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.includes(def.includes, def.position)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: def.includes,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.onattach.push((inst$1) => {
		const bag = inst$1._zod.bag;
		bag.patterns ?? (bag.patterns = new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.startsWith(def.prefix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: def.prefix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.onattach.push((inst$1) => {
		const bag = inst$1._zod.bag;
		bag.patterns ?? (bag.patterns = new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.endsWith(def.suffix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: def.suffix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.check = (payload) => {
		payload.value = def.tx(payload.value);
	};
});

//#endregion
//#region node_modules/zod/v4/core/doc.js
var Doc = class {
	constructor(args = []) {
		this.content = [];
		this.indent = 0;
		if (this) this.args = args;
	}
	indented(fn) {
		this.indent += 1;
		fn(this);
		this.indent -= 1;
	}
	write(arg) {
		if (typeof arg === "function") {
			arg(this, { execution: "sync" });
			arg(this, { execution: "async" });
			return;
		}
		const content = arg;
		const lines = content.split("\n").filter((x) => x);
		const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
		const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
		for (const line of dedented) this.content.push(line);
	}
	compile() {
		const F = Function;
		const args = this?.args;
		const content = this?.content ?? [``];
		const lines = [...content.map((x) => `  ${x}`)];
		return new F(...args, lines.join("\n"));
	}
};

//#endregion
//#region node_modules/zod/v4/core/versions.js
const version$1 = {
	major: 4,
	minor: 4,
	patch: 3
};

//#endregion
//#region node_modules/zod/v4/core/schemas.js
const $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
	var _a$2;
	inst ?? (inst = {});
	inst._zod.def = def;
	inst._zod.bag = inst._zod.bag || {};
	inst._zod.version = version$1;
	const checks = [...inst._zod.def.checks ?? []];
	if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
	for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
	if (checks.length === 0) {
		(_a$2 = inst._zod).deferred ?? (_a$2.deferred = []);
		inst._zod.deferred?.push(() => {
			inst._zod.run = inst._zod.parse;
		});
	} else {
		const runChecks = (payload, checks$1, ctx$1) => {
			let isAborted = aborted(payload);
			let asyncResult;
			for (const ch of checks$1) {
				if (ch._zod.def.when) {
					if (explicitlyAborted(payload)) continue;
					const shouldRun = ch._zod.def.when(payload);
					if (!shouldRun) continue;
				} else if (isAborted) continue;
				const currLen = payload.issues.length;
				const _ = ch._zod.check(payload);
				if (_ instanceof Promise && ctx$1?.async === false) throw new $ZodAsyncError();
				if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
					await _;
					const nextLen = payload.issues.length;
					if (nextLen === currLen) return;
					if (!isAborted) isAborted = aborted(payload, currLen);
				});
				else {
					const nextLen = payload.issues.length;
					if (nextLen === currLen) continue;
					if (!isAborted) isAborted = aborted(payload, currLen);
				}
			}
			if (asyncResult) return asyncResult.then(() => {
				return payload;
			});
			return payload;
		};
		const handleCanaryResult = (canary, payload, ctx$1) => {
			if (aborted(canary)) {
				canary.aborted = true;
				return canary;
			}
			const checkResult = runChecks(payload, checks, ctx$1);
			if (checkResult instanceof Promise) {
				if (ctx$1.async === false) throw new $ZodAsyncError();
				return checkResult.then((checkResult$1) => inst._zod.parse(checkResult$1, ctx$1));
			}
			return inst._zod.parse(checkResult, ctx$1);
		};
		inst._zod.run = (payload, ctx$1) => {
			if (ctx$1.skipChecks) return inst._zod.parse(payload, ctx$1);
			if (ctx$1.direction === "backward") {
				const canary = inst._zod.parse({
					value: payload.value,
					issues: []
				}, {
					...ctx$1,
					skipChecks: true
				});
				if (canary instanceof Promise) return canary.then((canary$1) => {
					return handleCanaryResult(canary$1, payload, ctx$1);
				});
				return handleCanaryResult(canary, payload, ctx$1);
			}
			const result = inst._zod.parse(payload, ctx$1);
			if (result instanceof Promise) {
				if (ctx$1.async === false) throw new $ZodAsyncError();
				return result.then((result$1) => runChecks(result$1, checks, ctx$1));
			}
			return runChecks(result, checks, ctx$1);
		};
	}
	defineLazy(inst, "~standard", () => ({
		validate: (value) => {
			try {
				const r = safeParse$1(inst, value);
				return r.success ? { value: r.data } : { issues: r.error?.issues };
			} catch (_) {
				return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
			}
		},
		vendor: "zod",
		version: 1
	}));
});
const $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
	inst._zod.parse = (payload, _) => {
		if (def.coerce) try {
			payload.value = String(payload.value);
		} catch (_$1) {}
		if (typeof payload.value === "string") return payload;
		payload.issues.push({
			expected: "string",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
const $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	$ZodString.init(inst, def);
});
const $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
	def.pattern ?? (def.pattern = guid);
	$ZodStringFormat.init(inst, def);
});
const $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
	if (def.version) {
		const versionMap = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		};
		const v = versionMap[def.version];
		if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
		def.pattern ?? (def.pattern = uuid(v));
	} else def.pattern ?? (def.pattern = uuid());
	$ZodStringFormat.init(inst, def);
});
const $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
	def.pattern ?? (def.pattern = email);
	$ZodStringFormat.init(inst, def);
});
const $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		try {
			const trimmed = payload.value.trim();
			if (!def.normalize && def.protocol?.source === httpProtocol.source) {
				if (!/^https?:\/\//i.test(trimmed)) {
					payload.issues.push({
						code: "invalid_format",
						format: "url",
						note: "Invalid URL format",
						input: payload.value,
						inst,
						continue: !def.abort
					});
					return;
				}
			}
			const url = new URL(trimmed);
			if (def.hostname) {
				def.hostname.lastIndex = 0;
				if (!def.hostname.test(url.hostname)) payload.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid hostname",
					pattern: def.hostname.source,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			}
			if (def.protocol) {
				def.protocol.lastIndex = 0;
				if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) payload.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid protocol",
					pattern: def.protocol.source,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			}
			if (def.normalize) payload.value = url.href;
			else payload.value = trimmed;
			return;
		} catch (_) {
			payload.issues.push({
				code: "invalid_format",
				format: "url",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
const $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
	def.pattern ?? (def.pattern = emoji());
	$ZodStringFormat.init(inst, def);
});
const $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
	def.pattern ?? (def.pattern = nanoid);
	$ZodStringFormat.init(inst, def);
});
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
* See https://github.com/paralleldrive/cuid.
*/
const $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
	def.pattern ?? (def.pattern = cuid);
	$ZodStringFormat.init(inst, def);
});
const $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
	def.pattern ?? (def.pattern = cuid2);
	$ZodStringFormat.init(inst, def);
});
const $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
	def.pattern ?? (def.pattern = ulid);
	$ZodStringFormat.init(inst, def);
});
const $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
	def.pattern ?? (def.pattern = xid);
	$ZodStringFormat.init(inst, def);
});
const $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
	def.pattern ?? (def.pattern = ksuid);
	$ZodStringFormat.init(inst, def);
});
const $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
	def.pattern ?? (def.pattern = datetime$1(def));
	$ZodStringFormat.init(inst, def);
});
const $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
	def.pattern ?? (def.pattern = date$1);
	$ZodStringFormat.init(inst, def);
});
const $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
	def.pattern ?? (def.pattern = time$1(def));
	$ZodStringFormat.init(inst, def);
});
const $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
	def.pattern ?? (def.pattern = duration$1);
	$ZodStringFormat.init(inst, def);
});
const $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
	def.pattern ?? (def.pattern = ipv4);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.format = `ipv4`;
});
const $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
	def.pattern ?? (def.pattern = ipv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.format = `ipv6`;
	inst._zod.check = (payload) => {
		try {
			new URL(`http://[${payload.value}]`);
		} catch {
			payload.issues.push({
				code: "invalid_format",
				format: "ipv6",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
const $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv4);
	$ZodStringFormat.init(inst, def);
});
const $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		const parts = payload.value.split("/");
		try {
			if (parts.length !== 2) throw new Error();
			const [address, prefix] = parts;
			if (!prefix) throw new Error();
			const prefixNum = Number(prefix);
			if (`${prefixNum}` !== prefix) throw new Error();
			if (prefixNum < 0 || prefixNum > 128) throw new Error();
			new URL(`http://[${address}]`);
		} catch {
			payload.issues.push({
				code: "invalid_format",
				format: "cidrv6",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
function isValidBase64(data) {
	if (data === "") return true;
	if (/\s/.test(data)) return false;
	if (data.length % 4 !== 0) return false;
	try {
		atob(data);
		return true;
	} catch {
		return false;
	}
}
const $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
	def.pattern ?? (def.pattern = base64);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.contentEncoding = "base64";
	inst._zod.check = (payload) => {
		if (isValidBase64(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
function isValidBase64URL(data) {
	if (!base64url.test(data)) return false;
	const base64$1 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
	const padded = base64$1.padEnd(Math.ceil(base64$1.length / 4) * 4, "=");
	return isValidBase64(padded);
}
const $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
	def.pattern ?? (def.pattern = base64url);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.contentEncoding = "base64url";
	inst._zod.check = (payload) => {
		if (isValidBase64URL(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
	def.pattern ?? (def.pattern = e164);
	$ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
	try {
		const tokensParts = token.split(".");
		if (tokensParts.length !== 3) return false;
		const [header] = tokensParts;
		if (!header) return false;
		const parsedHeader = JSON.parse(atob(header));
		if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
		if (!parsedHeader.alg) return false;
		if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
		return true;
	} catch {
		return false;
	}
}
const $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (isValidJWT(payload.value, def.alg)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Number(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
		const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
		payload.issues.push({
			expected: "number",
			code: "invalid_type",
			input,
			inst,
			...received ? { received } : {}
		});
		return payload;
	};
});
const $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
	$ZodCheckNumberFormat.init(inst, def);
	$ZodNumber.init(inst, def);
});
const $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = boolean$1;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Boolean(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "boolean") return payload;
		payload.issues.push({
			expected: "boolean",
			code: "invalid_type",
			input,
			inst
		});
		return payload;
	};
});
const $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload) => payload;
});
const $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _ctx) => {
		payload.issues.push({
			expected: "never",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
function handleArrayResult(result, final, index) {
	if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
	final.value[index] = result.value;
}
const $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx$1) => {
		const input = payload.value;
		if (!Array.isArray(input)) {
			payload.issues.push({
				expected: "array",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = Array(input.length);
		const proms = [];
		for (let i = 0; i < input.length; i++) {
			const item = input[i];
			const result = def.element._zod.run({
				value: item,
				issues: []
			}, ctx$1);
			if (result instanceof Promise) proms.push(result.then((result$1) => handleArrayResult(result$1, payload, i)));
			else handleArrayResult(result, payload, i);
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
});
function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
	const isPresent = key in input;
	if (result.issues.length) {
		if (isOptionalIn && isOptionalOut && !isPresent) return;
		final.issues.push(...prefixIssues(key, result.issues));
	}
	if (!isPresent && !isOptionalIn) {
		if (!result.issues.length) final.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: void 0,
			path: [key]
		});
		return;
	}
	if (result.value === void 0) {
		if (isPresent) final.value[key] = void 0;
	} else final.value[key] = result.value;
}
function normalizeDef(def) {
	const keys = Object.keys(def.shape);
	for (const k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
	const okeys = optionalKeys(def.shape);
	return {
		...def,
		keys,
		keySet: new Set(keys),
		numKeys: keys.length,
		optionalKeys: new Set(okeys)
	};
}
function handleCatchall(proms, input, payload, ctx$1, def, inst) {
	const unrecognized = [];
	const keySet = def.keySet;
	const _catchall = def.catchall._zod;
	const t = _catchall.def.type;
	const isOptionalIn = _catchall.optin === "optional";
	const isOptionalOut = _catchall.optout === "optional";
	for (const key in input) {
		if (key === "__proto__") continue;
		if (keySet.has(key)) continue;
		if (t === "never") {
			unrecognized.push(key);
			continue;
		}
		const r = _catchall.run({
			value: input[key],
			issues: []
		}, ctx$1);
		if (r instanceof Promise) proms.push(r.then((r$1) => handlePropertyResult(r$1, payload, key, input, isOptionalIn, isOptionalOut)));
		else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
	}
	if (unrecognized.length) payload.issues.push({
		code: "unrecognized_keys",
		keys: unrecognized,
		input,
		inst
	});
	if (!proms.length) return payload;
	return Promise.all(proms).then(() => {
		return payload;
	});
}
const $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
	$ZodType.init(inst, def);
	const desc = Object.getOwnPropertyDescriptor(def, "shape");
	if (!desc?.get) {
		const sh = def.shape;
		Object.defineProperty(def, "shape", { get: () => {
			const newSh = { ...sh };
			Object.defineProperty(def, "shape", { value: newSh });
			return newSh;
		} });
	}
	const _normalized = cached$1(() => normalizeDef(def));
	defineLazy(inst._zod, "propValues", () => {
		const shape = def.shape;
		const propValues = {};
		for (const key in shape) {
			const field = shape[key]._zod;
			if (field.values) {
				propValues[key] ?? (propValues[key] = new Set());
				for (const v of field.values) propValues[key].add(v);
			}
		}
		return propValues;
	});
	const isObject$1 = isObject;
	const catchall = def.catchall;
	let value;
	inst._zod.parse = (payload, ctx$1) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$1(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = {};
		const proms = [];
		const shape = value.shape;
		for (const key of value.keys) {
			const el = shape[key];
			const isOptionalIn = el._zod.optin === "optional";
			const isOptionalOut = el._zod.optout === "optional";
			const r = el._zod.run({
				value: input[key],
				issues: []
			}, ctx$1);
			if (r instanceof Promise) proms.push(r.then((r$1) => handlePropertyResult(r$1, payload, key, input, isOptionalIn, isOptionalOut)));
			else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
		}
		if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
		return handleCatchall(proms, input, payload, ctx$1, _normalized.value, inst);
	};
});
const $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
	$ZodObject.init(inst, def);
	const superParse = inst._zod.parse;
	const _normalized = cached$1(() => normalizeDef(def));
	const generateFastpass = (shape) => {
		const doc = new Doc([
			"shape",
			"payload",
			"ctx"
		]);
		const normalized = _normalized.value;
		const parseStr = (key) => {
			const k = esc(key);
			return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
		};
		doc.write(`const input = payload.value;`);
		const ids = Object.create(null);
		let counter = 0;
		for (const key of normalized.keys) ids[key] = `key_${counter++}`;
		doc.write(`const newResult = {};`);
		for (const key of normalized.keys) {
			const id = ids[key];
			const k = esc(key);
			const schema = shape[key];
			const isOptionalIn = schema?._zod?.optin === "optional";
			const isOptionalOut = schema?._zod?.optout === "optional";
			doc.write(`const ${id} = ${parseStr(key)};`);
			if (isOptionalIn && isOptionalOut) doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
			else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
			else doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
		}
		doc.write(`payload.value = newResult;`);
		doc.write(`return payload;`);
		const fn = doc.compile();
		return (payload, ctx$1) => fn(shape, payload, ctx$1);
	};
	let fastpass;
	const isObject$1 = isObject;
	const jit = !globalConfig.jitless;
	const allowsEval$1 = allowsEval;
	const fastEnabled = jit && allowsEval$1.value;
	const catchall = def.catchall;
	let value;
	inst._zod.parse = (payload, ctx$1) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$1(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		if (jit && fastEnabled && ctx$1?.async === false && ctx$1.jitless !== true) {
			if (!fastpass) fastpass = generateFastpass(def.shape);
			payload = fastpass(payload, ctx$1);
			if (!catchall) return payload;
			return handleCatchall([], input, payload, ctx$1, value, inst);
		}
		return superParse(payload, ctx$1);
	};
});
function handleUnionResults(results, final, inst, ctx$1) {
	for (const result of results) if (result.issues.length === 0) {
		final.value = result.value;
		return final;
	}
	const nonaborted = results.filter((r) => !aborted(r));
	if (nonaborted.length === 1) {
		final.value = nonaborted[0].value;
		return nonaborted[0];
	}
	final.issues.push({
		code: "invalid_union",
		input: final.value,
		inst,
		errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx$1, config())))
	});
	return final;
}
const $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
	defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
	defineLazy(inst._zod, "values", () => {
		if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
		return void 0;
	});
	defineLazy(inst._zod, "pattern", () => {
		if (def.options.every((o) => o._zod.pattern)) {
			const patterns = def.options.map((o) => o._zod.pattern);
			return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
		}
		return void 0;
	});
	const first = def.options.length === 1 ? def.options[0]._zod.run : null;
	inst._zod.parse = (payload, ctx$1) => {
		if (first) return first(payload, ctx$1);
		let async = false;
		const results = [];
		for (const option of def.options) {
			const result = option._zod.run({
				value: payload.value,
				issues: []
			}, ctx$1);
			if (result instanceof Promise) {
				results.push(result);
				async = true;
			} else {
				if (result.issues.length === 0) return result;
				results.push(result);
			}
		}
		if (!async) return handleUnionResults(results, payload, inst, ctx$1);
		return Promise.all(results).then((results$1) => {
			return handleUnionResults(results$1, payload, inst, ctx$1);
		});
	};
});
const $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx$1) => {
		const input = payload.value;
		const left = def.left._zod.run({
			value: input,
			issues: []
		}, ctx$1);
		const right = def.right._zod.run({
			value: input,
			issues: []
		}, ctx$1);
		const async = left instanceof Promise || right instanceof Promise;
		if (async) return Promise.all([left, right]).then(([left$1, right$1]) => {
			return handleIntersectionResults(payload, left$1, right$1);
		});
		return handleIntersectionResults(payload, left, right);
	};
});
function mergeValues(a, b) {
	if (a === b) return {
		valid: true,
		data: a
	};
	if (a instanceof Date && b instanceof Date && +a === +b) return {
		valid: true,
		data: a
	};
	if (isPlainObject(a) && isPlainObject(b)) {
		const bKeys = Object.keys(b);
		const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
		const newObj = {
			...a,
			...b
		};
		for (const key of sharedKeys) {
			const sharedValue = mergeValues(a[key], b[key]);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
			};
			newObj[key] = sharedValue.data;
		}
		return {
			valid: true,
			data: newObj
		};
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return {
			valid: false,
			mergeErrorPath: []
		};
		const newArray = [];
		for (let index = 0; index < a.length; index++) {
			const itemA = a[index];
			const itemB = b[index];
			const sharedValue = mergeValues(itemA, itemB);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
			};
			newArray.push(sharedValue.data);
		}
		return {
			valid: true,
			data: newArray
		};
	}
	return {
		valid: false,
		mergeErrorPath: []
	};
}
function handleIntersectionResults(result, left, right) {
	const unrecKeys = new Map();
	let unrecIssue;
	for (const iss of left.issues) if (iss.code === "unrecognized_keys") {
		unrecIssue ?? (unrecIssue = iss);
		for (const k of iss.keys) {
			if (!unrecKeys.has(k)) unrecKeys.set(k, {});
			unrecKeys.get(k).l = true;
		}
	} else result.issues.push(iss);
	for (const iss of right.issues) if (iss.code === "unrecognized_keys") for (const k of iss.keys) {
		if (!unrecKeys.has(k)) unrecKeys.set(k, {});
		unrecKeys.get(k).r = true;
	}
	else result.issues.push(iss);
	const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
	if (bothKeys.length && unrecIssue) result.issues.push({
		...unrecIssue,
		keys: bothKeys
	});
	if (aborted(result)) return result;
	const merged = mergeValues(left.value, right.value);
	if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
	result.value = merged.data;
	return result;
}
const $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
	$ZodType.init(inst, def);
	const values = getEnumValues(def.entries);
	const valuesSet = new Set(values);
	inst._zod.values = valuesSet;
	inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (valuesSet.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values,
			input,
			inst
		});
		return payload;
	};
});
const $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
	$ZodType.init(inst, def);
	if (def.values.length === 0) throw new Error("Cannot create literal schema with no valid values");
	const values = new Set(def.values);
	inst._zod.values = values;
	inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (values.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values: def.values,
			input,
			inst
		});
		return payload;
	};
});
const $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	inst._zod.parse = (payload, ctx$1) => {
		if (ctx$1.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		const _out = def.transform(payload.value, payload);
		if (ctx$1.async) {
			const output = _out instanceof Promise ? _out : Promise.resolve(_out);
			return output.then((output$1) => {
				payload.value = output$1;
				payload.fallback = true;
				return payload;
			});
		}
		if (_out instanceof Promise) throw new $ZodAsyncError();
		payload.value = _out;
		payload.fallback = true;
		return payload;
	};
});
function handleOptionalResult(result, input) {
	if (input === void 0 && (result.issues.length || result.fallback)) return {
		issues: [],
		value: void 0
	};
	return result;
}
const $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	inst._zod.optout = "optional";
	defineLazy(inst._zod, "values", () => {
		return def.innerType._zod.values ? new Set([...def.innerType._zod.values, void 0]) : void 0;
	});
	defineLazy(inst._zod, "pattern", () => {
		const pattern = def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
	});
	inst._zod.parse = (payload, ctx$1) => {
		if (def.innerType._zod.optin === "optional") {
			const input = payload.value;
			const result = def.innerType._zod.run(payload, ctx$1);
			if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, input));
			return handleOptionalResult(result, input);
		}
		if (payload.value === void 0) return payload;
		return def.innerType._zod.run(payload, ctx$1);
	};
});
const $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
	inst._zod.parse = (payload, ctx$1) => {
		return def.innerType._zod.run(payload, ctx$1);
	};
});
const $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
	defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
	defineLazy(inst._zod, "pattern", () => {
		const pattern = def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
	});
	defineLazy(inst._zod, "values", () => {
		return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : void 0;
	});
	inst._zod.parse = (payload, ctx$1) => {
		if (payload.value === null) return payload;
		return def.innerType._zod.run(payload, ctx$1);
	};
});
const $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx$1) => {
		if (ctx$1.direction === "backward") return def.innerType._zod.run(payload, ctx$1);
		if (payload.value === void 0) {
			payload.value = def.defaultValue;
			/**
			* $ZodDefault returns the default value immediately in forward direction.
			* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
			return payload;
		}
		const result = def.innerType._zod.run(payload, ctx$1);
		if (result instanceof Promise) return result.then((result$1) => handleDefaultResult(result$1, def));
		return handleDefaultResult(result, def);
	};
});
function handleDefaultResult(payload, def) {
	if (payload.value === void 0) payload.value = def.defaultValue;
	return payload;
}
const $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx$1) => {
		if (ctx$1.direction === "backward") return def.innerType._zod.run(payload, ctx$1);
		if (payload.value === void 0) payload.value = def.defaultValue;
		return def.innerType._zod.run(payload, ctx$1);
	};
});
const $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "values", () => {
		const v = def.innerType._zod.values;
		return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
	});
	inst._zod.parse = (payload, ctx$1) => {
		const result = def.innerType._zod.run(payload, ctx$1);
		if (result instanceof Promise) return result.then((result$1) => handleNonOptionalResult(result$1, inst));
		return handleNonOptionalResult(result, inst);
	};
});
function handleNonOptionalResult(payload, inst) {
	if (!payload.issues.length && payload.value === void 0) payload.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: payload.value,
		inst
	});
	return payload;
}
const $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx$1) => {
		if (ctx$1.direction === "backward") return def.innerType._zod.run(payload, ctx$1);
		const result = def.innerType._zod.run(payload, ctx$1);
		if (result instanceof Promise) return result.then((result$1) => {
			payload.value = result$1.value;
			if (result$1.issues.length) {
				payload.value = def.catchValue({
					...payload,
					error: { issues: result$1.issues.map((iss) => finalizeIssue(iss, ctx$1, config())) },
					input: payload.value
				});
				payload.issues = [];
				payload.fallback = true;
			}
			return payload;
		});
		payload.value = result.value;
		if (result.issues.length) {
			payload.value = def.catchValue({
				...payload,
				error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx$1, config())) },
				input: payload.value
			});
			payload.issues = [];
			payload.fallback = true;
		}
		return payload;
	};
});
const $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "values", () => def.in._zod.values);
	defineLazy(inst._zod, "optin", () => def.in._zod.optin);
	defineLazy(inst._zod, "optout", () => def.out._zod.optout);
	defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
	inst._zod.parse = (payload, ctx$1) => {
		if (ctx$1.direction === "backward") {
			const right = def.out._zod.run(payload, ctx$1);
			if (right instanceof Promise) return right.then((right$1) => handlePipeResult(right$1, def.in, ctx$1));
			return handlePipeResult(right, def.in, ctx$1);
		}
		const left = def.in._zod.run(payload, ctx$1);
		if (left instanceof Promise) return left.then((left$1) => handlePipeResult(left$1, def.out, ctx$1));
		return handlePipeResult(left, def.out, ctx$1);
	};
});
function handlePipeResult(left, next, ctx$1) {
	if (left.issues.length) {
		left.aborted = true;
		return left;
	}
	return next._zod.run({
		value: left.value,
		issues: left.issues,
		fallback: left.fallback
	}, ctx$1);
}
const $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
	defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
	inst._zod.parse = (payload, ctx$1) => {
		if (ctx$1.direction === "backward") return def.innerType._zod.run(payload, ctx$1);
		const result = def.innerType._zod.run(payload, ctx$1);
		if (result instanceof Promise) return result.then(handleReadonlyResult);
		return handleReadonlyResult(result);
	};
});
function handleReadonlyResult(payload) {
	payload.value = Object.freeze(payload.value);
	return payload;
}
const $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
	$ZodCheck.init(inst, def);
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _) => {
		return payload;
	};
	inst._zod.check = (payload) => {
		const input = payload.value;
		const r = def.fn(input);
		if (r instanceof Promise) return r.then((r$1) => handleRefineResult(r$1, payload, input, inst));
		handleRefineResult(r, payload, input, inst);
		return;
	};
});
function handleRefineResult(result, payload, input, inst) {
	if (!result) {
		const _iss = {
			code: "custom",
			input,
			inst,
			path: [...inst._zod.def.path ?? []],
			continue: !inst._zod.def.abort
		};
		if (inst._zod.def.params) _iss.params = inst._zod.def.params;
		payload.issues.push(issue(_iss));
	}
}

//#endregion
//#region node_modules/zod/v4/core/registries.js
var _a;
const $output = Symbol("ZodOutput");
const $input = Symbol("ZodInput");
var $ZodRegistry = class {
	constructor() {
		this._map = new WeakMap();
		this._idmap = new Map();
	}
	add(schema, ..._meta) {
		const meta$2 = _meta[0];
		this._map.set(schema, meta$2);
		if (meta$2 && typeof meta$2 === "object" && "id" in meta$2) this._idmap.set(meta$2.id, schema);
		return this;
	}
	clear() {
		this._map = new WeakMap();
		this._idmap = new Map();
		return this;
	}
	remove(schema) {
		const meta$2 = this._map.get(schema);
		if (meta$2 && typeof meta$2 === "object" && "id" in meta$2) this._idmap.delete(meta$2.id);
		this._map.delete(schema);
		return this;
	}
	get(schema) {
		const p = schema._zod.parent;
		if (p) {
			const pm = { ...this.get(p) ?? {} };
			delete pm.id;
			const f = {
				...pm,
				...this._map.get(schema)
			};
			return Object.keys(f).length ? f : void 0;
		}
		return this._map.get(schema);
	}
	has(schema) {
		return this._map.has(schema);
	}
};
function registry() {
	return new $ZodRegistry();
}
(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
const globalRegistry = globalThis.__zod_globalRegistry;

//#endregion
//#region node_modules/zod/v4/core/api.js
/* @__NO_SIDE_EFFECTS__ */
function _string(Class, params) {
	return new Class({
		type: "string",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _email(Class, params) {
	return new Class({
		type: "string",
		format: "email",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _guid(Class, params) {
	return new Class({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _uuid(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _uuidv4(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v4",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _uuidv6(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v6",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _uuidv7(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v7",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _url(Class, params) {
	return new Class({
		type: "string",
		format: "url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _emoji(Class, params) {
	return new Class({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _nanoid(Class, params) {
	return new Class({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link _cuid2} instead.
* See https://github.com/paralleldrive/cuid.
*/
/* @__NO_SIDE_EFFECTS__ */
function _cuid(Class, params) {
	return new Class({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _cuid2(Class, params) {
	return new Class({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _ulid(Class, params) {
	return new Class({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _xid(Class, params) {
	return new Class({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _ksuid(Class, params) {
	return new Class({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _ipv4(Class, params) {
	return new Class({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _ipv6(Class, params) {
	return new Class({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _cidrv4(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _cidrv6(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _base64(Class, params) {
	return new Class({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _base64url(Class, params) {
	return new Class({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _e164(Class, params) {
	return new Class({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _jwt(Class, params) {
	return new Class({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _isoDateTime(Class, params) {
	return new Class({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: false,
		local: false,
		precision: null,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _isoDate(Class, params) {
	return new Class({
		type: "string",
		format: "date",
		check: "string_format",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _isoTime(Class, params) {
	return new Class({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _isoDuration(Class, params) {
	return new Class({
		type: "string",
		format: "duration",
		check: "string_format",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _number(Class, params) {
	return new Class({
		type: "number",
		checks: [],
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _int(Class, params) {
	return new Class({
		type: "number",
		check: "number_format",
		abort: false,
		format: "safeint",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _boolean(Class, params) {
	return new Class({
		type: "boolean",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _unknown(Class) {
	return new Class({ type: "unknown" });
}
/* @__NO_SIDE_EFFECTS__ */
function _never(Class, params) {
	return new Class({
		type: "never",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _lt(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _lte(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _gt(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _gte(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _multipleOf(value, params) {
	return new $ZodCheckMultipleOf({
		check: "multiple_of",
		...normalizeParams(params),
		value
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _maxLength(maximum, params) {
	const ch = new $ZodCheckMaxLength({
		check: "max_length",
		...normalizeParams(params),
		maximum
	});
	return ch;
}
/* @__NO_SIDE_EFFECTS__ */
function _minLength(minimum, params) {
	return new $ZodCheckMinLength({
		check: "min_length",
		...normalizeParams(params),
		minimum
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _length(length, params) {
	return new $ZodCheckLengthEquals({
		check: "length_equals",
		...normalizeParams(params),
		length
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _regex(pattern, params) {
	return new $ZodCheckRegex({
		check: "string_format",
		format: "regex",
		...normalizeParams(params),
		pattern
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _lowercase(params) {
	return new $ZodCheckLowerCase({
		check: "string_format",
		format: "lowercase",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _uppercase(params) {
	return new $ZodCheckUpperCase({
		check: "string_format",
		format: "uppercase",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _includes(includes, params) {
	return new $ZodCheckIncludes({
		check: "string_format",
		format: "includes",
		...normalizeParams(params),
		includes
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _startsWith(prefix, params) {
	return new $ZodCheckStartsWith({
		check: "string_format",
		format: "starts_with",
		...normalizeParams(params),
		prefix
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _endsWith(suffix, params) {
	return new $ZodCheckEndsWith({
		check: "string_format",
		format: "ends_with",
		...normalizeParams(params),
		suffix
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _overwrite(tx) {
	return new $ZodCheckOverwrite({
		check: "overwrite",
		tx
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _normalize(form) {
	return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
}
/* @__NO_SIDE_EFFECTS__ */
function _trim() {
	return /* @__PURE__ */ _overwrite((input) => input.trim());
}
/* @__NO_SIDE_EFFECTS__ */
function _toLowerCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
}
/* @__NO_SIDE_EFFECTS__ */
function _toUpperCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
}
/* @__NO_SIDE_EFFECTS__ */
function _slugify() {
	return /* @__PURE__ */ _overwrite((input) => slugify(input));
}
/* @__NO_SIDE_EFFECTS__ */
function _array(Class, element, params) {
	return new Class({
		type: "array",
		element,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _refine(Class, fn, _params) {
	const schema = new Class({
		type: "custom",
		check: "custom",
		fn,
		...normalizeParams(_params)
	});
	return schema;
}
/* @__NO_SIDE_EFFECTS__ */
function _superRefine(fn, params) {
	const ch = /* @__PURE__ */ _check((payload) => {
		payload.addIssue = (issue$1) => {
			if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, ch._zod.def));
			else {
				const _issue = issue$1;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				_issue.input ?? (_issue.input = payload.value);
				_issue.inst ?? (_issue.inst = ch);
				_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
				payload.issues.push(issue(_issue));
			}
		};
		return fn(payload.value, payload);
	}, params);
	return ch;
}
/* @__NO_SIDE_EFFECTS__ */
function _check(fn, params) {
	const ch = new $ZodCheck({
		check: "custom",
		...normalizeParams(params)
	});
	ch._zod.check = fn;
	return ch;
}
/* @__NO_SIDE_EFFECTS__ */
function describe$1(description) {
	const ch = new $ZodCheck({ check: "describe" });
	ch._zod.onattach = [(inst) => {
		const existing = globalRegistry.get(inst) ?? {};
		globalRegistry.add(inst, {
			...existing,
			description
		});
	}];
	ch._zod.check = () => {};
	return ch;
}
/* @__NO_SIDE_EFFECTS__ */
function meta$1(metadata) {
	const ch = new $ZodCheck({ check: "meta" });
	ch._zod.onattach = [(inst) => {
		const existing = globalRegistry.get(inst) ?? {};
		globalRegistry.add(inst, {
			...existing,
			...metadata
		});
	}];
	ch._zod.check = () => {};
	return ch;
}

//#endregion
//#region node_modules/zod/v4/core/to-json-schema.js
function initializeContext(params) {
	let target = params?.target ?? "draft-2020-12";
	if (target === "draft-4") target = "draft-04";
	if (target === "draft-7") target = "draft-07";
	return {
		processors: params.processors ?? {},
		metadataRegistry: params?.metadata ?? globalRegistry,
		target,
		unrepresentable: params?.unrepresentable ?? "throw",
		override: params?.override ?? (() => {}),
		io: params?.io ?? "output",
		counter: 0,
		seen: new Map(),
		cycles: params?.cycles ?? "ref",
		reused: params?.reused ?? "inline",
		external: params?.external ?? void 0
	};
}
function process(schema, ctx$1, _params = {
	path: [],
	schemaPath: []
}) {
	var _a$2;
	const def = schema._zod.def;
	const seen = ctx$1.seen.get(schema);
	if (seen) {
		seen.count++;
		const isCycle = _params.schemaPath.includes(schema);
		if (isCycle) seen.cycle = _params.path;
		return seen.schema;
	}
	const result = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: _params.path
	};
	ctx$1.seen.set(schema, result);
	const overrideSchema = schema._zod.toJSONSchema?.();
	if (overrideSchema) result.schema = overrideSchema;
	else {
		const params = {
			..._params,
			schemaPath: [..._params.schemaPath, schema],
			path: _params.path
		};
		if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx$1, result.schema, params);
		else {
			const _json = result.schema;
			const processor = ctx$1.processors[def.type];
			if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
			processor(schema, ctx$1, _json, params);
		}
		const parent = schema._zod.parent;
		if (parent) {
			if (!result.ref) result.ref = parent;
			process(parent, ctx$1, params);
			ctx$1.seen.get(parent).isParent = true;
		}
	}
	const meta$2 = ctx$1.metadataRegistry.get(schema);
	if (meta$2) Object.assign(result.schema, meta$2);
	if (ctx$1.io === "input" && isTransforming(schema)) {
		delete result.schema.examples;
		delete result.schema.default;
	}
	if (ctx$1.io === "input" && "_prefault" in result.schema) (_a$2 = result.schema).default ?? (_a$2.default = result.schema._prefault);
	delete result.schema._prefault;
	const _result = ctx$1.seen.get(schema);
	return _result.schema;
}
function extractDefs(ctx$1, schema) {
	const root$1 = ctx$1.seen.get(schema);
	if (!root$1) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const idToSchema = new Map();
	for (const entry of ctx$1.seen.entries()) {
		const id = ctx$1.metadataRegistry.get(entry[0])?.id;
		if (id) {
			const existing = idToSchema.get(id);
			if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			idToSchema.set(id, entry[0]);
		}
	}
	const makeURI = (entry) => {
		const defsSegment = ctx$1.target === "draft-2020-12" ? "$defs" : "definitions";
		if (ctx$1.external) {
			const externalId = ctx$1.external.registry.get(entry[0])?.id;
			const uriGenerator = ctx$1.external.uri ?? ((id$1) => id$1);
			if (externalId) return { ref: uriGenerator(externalId) };
			const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx$1.counter++}`;
			entry[1].defId = id;
			return {
				defId: id,
				ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}`
			};
		}
		if (entry[1] === root$1) return { ref: "#" };
		const uriPrefix = `#`;
		const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
		const defId = entry[1].schema.id ?? `__schema${ctx$1.counter++}`;
		return {
			defId,
			ref: defUriPrefix + defId
		};
	};
	const extractToDef = (entry) => {
		if (entry[1].schema.$ref) return;
		const seen = entry[1];
		const { ref, defId } = makeURI(entry);
		seen.def = { ...seen.schema };
		if (defId) seen.defId = defId;
		const schema$1 = seen.schema;
		for (const key in schema$1) delete schema$1[key];
		schema$1.$ref = ref;
	};
	if (ctx$1.cycles === "throw") for (const entry of ctx$1.seen.entries()) {
		const seen = entry[1];
		if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (const entry of ctx$1.seen.entries()) {
		const seen = entry[1];
		if (schema === entry[0]) {
			extractToDef(entry);
			continue;
		}
		if (ctx$1.external) {
			const ext = ctx$1.external.registry.get(entry[0])?.id;
			if (schema !== entry[0] && ext) {
				extractToDef(entry);
				continue;
			}
		}
		const id = ctx$1.metadataRegistry.get(entry[0])?.id;
		if (id) {
			extractToDef(entry);
			continue;
		}
		if (seen.cycle) {
			extractToDef(entry);
			continue;
		}
		if (seen.count > 1) {
			if (ctx$1.reused === "ref") {
				extractToDef(entry);
				continue;
			}
		}
	}
}
function finalize(ctx$1, schema) {
	const root$1 = ctx$1.seen.get(schema);
	if (!root$1) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const flattenRef = (zodSchema) => {
		const seen = ctx$1.seen.get(zodSchema);
		if (seen.ref === null) return;
		const schema$1 = seen.def ?? seen.schema;
		const _cached = { ...schema$1 };
		const ref = seen.ref;
		seen.ref = null;
		if (ref) {
			flattenRef(ref);
			const refSeen = ctx$1.seen.get(ref);
			const refSchema = refSeen.schema;
			if (refSchema.$ref && (ctx$1.target === "draft-07" || ctx$1.target === "draft-04" || ctx$1.target === "openapi-3.0")) {
				schema$1.allOf = schema$1.allOf ?? [];
				schema$1.allOf.push(refSchema);
			} else Object.assign(schema$1, refSchema);
			Object.assign(schema$1, _cached);
			const isParentRef = zodSchema._zod.parent === ref;
			if (isParentRef) for (const key in schema$1) {
				if (key === "$ref" || key === "allOf") continue;
				if (!(key in _cached)) delete schema$1[key];
			}
			if (refSchema.$ref && refSeen.def) for (const key in schema$1) {
				if (key === "$ref" || key === "allOf") continue;
				if (key in refSeen.def && JSON.stringify(schema$1[key]) === JSON.stringify(refSeen.def[key])) delete schema$1[key];
			}
		}
		const parent = zodSchema._zod.parent;
		if (parent && parent !== ref) {
			flattenRef(parent);
			const parentSeen = ctx$1.seen.get(parent);
			if (parentSeen?.schema.$ref) {
				schema$1.$ref = parentSeen.schema.$ref;
				if (parentSeen.def) for (const key in schema$1) {
					if (key === "$ref" || key === "allOf") continue;
					if (key in parentSeen.def && JSON.stringify(schema$1[key]) === JSON.stringify(parentSeen.def[key])) delete schema$1[key];
				}
			}
		}
		ctx$1.override({
			zodSchema,
			jsonSchema: schema$1,
			path: seen.path ?? []
		});
	};
	for (const entry of [...ctx$1.seen.entries()].reverse()) flattenRef(entry[0]);
	const result = {};
	if (ctx$1.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
	else if (ctx$1.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
	else if (ctx$1.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
	else if (ctx$1.target === "openapi-3.0") {}
	if (ctx$1.external?.uri) {
		const id = ctx$1.external.registry.get(schema)?.id;
		if (!id) throw new Error("Schema is missing an `id` property");
		result.$id = ctx$1.external.uri(id);
	}
	Object.assign(result, root$1.def ?? root$1.schema);
	const rootMetaId = ctx$1.metadataRegistry.get(schema)?.id;
	if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
	const defs = ctx$1.external?.defs ?? {};
	for (const entry of ctx$1.seen.entries()) {
		const seen = entry[1];
		if (seen.def && seen.defId) {
			if (seen.def.id === seen.defId) delete seen.def.id;
			defs[seen.defId] = seen.def;
		}
	}
	if (ctx$1.external) {} else if (Object.keys(defs).length > 0) if (ctx$1.target === "draft-2020-12") result.$defs = defs;
	else result.definitions = defs;
	try {
		const finalized = JSON.parse(JSON.stringify(result));
		Object.defineProperty(finalized, "~standard", {
			value: {
				...schema["~standard"],
				jsonSchema: {
					input: createStandardJSONSchemaMethod(schema, "input", ctx$1.processors),
					output: createStandardJSONSchemaMethod(schema, "output", ctx$1.processors)
				}
			},
			enumerable: false,
			writable: false
		});
		return finalized;
	} catch (_err) {
		throw new Error("Error converting schema to JSON.");
	}
}
function isTransforming(_schema, _ctx) {
	const ctx$1 = _ctx ?? { seen: new Set() };
	if (ctx$1.seen.has(_schema)) return false;
	ctx$1.seen.add(_schema);
	const def = _schema._zod.def;
	if (def.type === "transform") return true;
	if (def.type === "array") return isTransforming(def.element, ctx$1);
	if (def.type === "set") return isTransforming(def.valueType, ctx$1);
	if (def.type === "lazy") return isTransforming(def.getter(), ctx$1);
	if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") return isTransforming(def.innerType, ctx$1);
	if (def.type === "intersection") return isTransforming(def.left, ctx$1) || isTransforming(def.right, ctx$1);
	if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx$1) || isTransforming(def.valueType, ctx$1);
	if (def.type === "pipe") {
		if (_schema._zod.traits.has("$ZodCodec")) return true;
		return isTransforming(def.in, ctx$1) || isTransforming(def.out, ctx$1);
	}
	if (def.type === "object") {
		for (const key in def.shape) if (isTransforming(def.shape[key], ctx$1)) return true;
		return false;
	}
	if (def.type === "union") {
		for (const option of def.options) if (isTransforming(option, ctx$1)) return true;
		return false;
	}
	if (def.type === "tuple") {
		for (const item of def.items) if (isTransforming(item, ctx$1)) return true;
		if (def.rest && isTransforming(def.rest, ctx$1)) return true;
		return false;
	}
	return false;
}
/**
* Creates a toJSONSchema method for a schema instance.
* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
*/
const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
	const ctx$1 = initializeContext({
		...params,
		processors
	});
	process(schema, ctx$1);
	extractDefs(ctx$1, schema);
	return finalize(ctx$1, schema);
};
const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
	const { libraryOptions, target } = params ?? {};
	const ctx$1 = initializeContext({
		...libraryOptions ?? {},
		target,
		io,
		processors
	});
	process(schema, ctx$1);
	extractDefs(ctx$1, schema);
	return finalize(ctx$1, schema);
};

//#endregion
//#region node_modules/zod/v4/core/json-schema-processors.js
const formatMap = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
};
const stringProcessor = (schema, ctx$1, _json, _params) => {
	const json = _json;
	json.type = "string";
	const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
	if (typeof minimum === "number") json.minLength = minimum;
	if (typeof maximum === "number") json.maxLength = maximum;
	if (format) {
		json.format = formatMap[format] ?? format;
		if (json.format === "") delete json.format;
		if (format === "time") delete json.format;
	}
	if (contentEncoding) json.contentEncoding = contentEncoding;
	if (patterns && patterns.size > 0) {
		const regexes = [...patterns];
		if (regexes.length === 1) json.pattern = regexes[0].source;
		else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => ({
			...ctx$1.target === "draft-07" || ctx$1.target === "draft-04" || ctx$1.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: regex.source
		}))];
	}
};
const numberProcessor = (schema, ctx$1, _json, _params) => {
	const json = _json;
	const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
	if (typeof format === "string" && format.includes("int")) json.type = "integer";
	else json.type = "number";
	const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
	const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
	const legacy = ctx$1.target === "draft-04" || ctx$1.target === "openapi-3.0";
	if (exMin) if (legacy) {
		json.minimum = exclusiveMinimum;
		json.exclusiveMinimum = true;
	} else json.exclusiveMinimum = exclusiveMinimum;
	else if (typeof minimum === "number") json.minimum = minimum;
	if (exMax) if (legacy) {
		json.maximum = exclusiveMaximum;
		json.exclusiveMaximum = true;
	} else json.exclusiveMaximum = exclusiveMaximum;
	else if (typeof maximum === "number") json.maximum = maximum;
	if (typeof multipleOf === "number") json.multipleOf = multipleOf;
};
const booleanProcessor = (_schema, _ctx, json, _params) => {
	json.type = "boolean";
};
const neverProcessor = (_schema, _ctx, json, _params) => {
	json.not = {};
};
const unknownProcessor = (_schema, _ctx, _json, _params) => {};
const enumProcessor = (schema, _ctx, json, _params) => {
	const def = schema._zod.def;
	const values = getEnumValues(def.entries);
	if (values.every((v) => typeof v === "number")) json.type = "number";
	if (values.every((v) => typeof v === "string")) json.type = "string";
	json.enum = values;
};
const literalProcessor = (schema, ctx$1, json, _params) => {
	const def = schema._zod.def;
	const vals = [];
	for (const val of def.values) if (val === void 0) {
		if (ctx$1.unrepresentable === "throw") throw new Error("Literal `undefined` cannot be represented in JSON Schema");
	} else if (typeof val === "bigint") if (ctx$1.unrepresentable === "throw") throw new Error("BigInt literals cannot be represented in JSON Schema");
	else vals.push(Number(val));
	else vals.push(val);
	if (vals.length === 0) {} else if (vals.length === 1) {
		const val = vals[0];
		json.type = val === null ? "null" : typeof val;
		if (ctx$1.target === "draft-04" || ctx$1.target === "openapi-3.0") json.enum = [val];
		else json.const = val;
	} else {
		if (vals.every((v) => typeof v === "number")) json.type = "number";
		if (vals.every((v) => typeof v === "string")) json.type = "string";
		if (vals.every((v) => typeof v === "boolean")) json.type = "boolean";
		if (vals.every((v) => v === null)) json.type = "null";
		json.enum = vals;
	}
};
const customProcessor = (_schema, ctx$1, _json, _params) => {
	if (ctx$1.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
};
const transformProcessor = (_schema, ctx$1, _json, _params) => {
	if (ctx$1.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
};
const arrayProcessor = (schema, ctx$1, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	const { minimum, maximum } = schema._zod.bag;
	if (typeof minimum === "number") json.minItems = minimum;
	if (typeof maximum === "number") json.maxItems = maximum;
	json.type = "array";
	json.items = process(def.element, ctx$1, {
		...params,
		path: [...params.path, "items"]
	});
};
const objectProcessor = (schema, ctx$1, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	json.type = "object";
	json.properties = {};
	const shape = def.shape;
	for (const key in shape) json.properties[key] = process(shape[key], ctx$1, {
		...params,
		path: [
			...params.path,
			"properties",
			key
		]
	});
	const allKeys = new Set(Object.keys(shape));
	const requiredKeys = new Set([...allKeys].filter((key) => {
		const v = def.shape[key]._zod;
		if (ctx$1.io === "input") return v.optin === void 0;
		else return v.optout === void 0;
	}));
	if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
	if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
	else if (!def.catchall) {
		if (ctx$1.io === "output") json.additionalProperties = false;
	} else if (def.catchall) json.additionalProperties = process(def.catchall, ctx$1, {
		...params,
		path: [...params.path, "additionalProperties"]
	});
};
const unionProcessor = (schema, ctx$1, json, params) => {
	const def = schema._zod.def;
	const isExclusive = def.inclusive === false;
	const options = def.options.map((x, i) => process(x, ctx$1, {
		...params,
		path: [
			...params.path,
			isExclusive ? "oneOf" : "anyOf",
			i
		]
	}));
	if (isExclusive) json.oneOf = options;
	else json.anyOf = options;
};
const intersectionProcessor = (schema, ctx$1, json, params) => {
	const def = schema._zod.def;
	const a = process(def.left, ctx$1, {
		...params,
		path: [
			...params.path,
			"allOf",
			0
		]
	});
	const b = process(def.right, ctx$1, {
		...params,
		path: [
			...params.path,
			"allOf",
			1
		]
	});
	const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
	const allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
	json.allOf = allOf;
};
const nullableProcessor = (schema, ctx$1, json, params) => {
	const def = schema._zod.def;
	const inner = process(def.innerType, ctx$1, params);
	const seen = ctx$1.seen.get(schema);
	if (ctx$1.target === "openapi-3.0") {
		seen.ref = def.innerType;
		json.nullable = true;
	} else json.anyOf = [inner, { type: "null" }];
};
const nonoptionalProcessor = (schema, ctx$1, _json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx$1, params);
	const seen = ctx$1.seen.get(schema);
	seen.ref = def.innerType;
};
const defaultProcessor = (schema, ctx$1, json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx$1, params);
	const seen = ctx$1.seen.get(schema);
	seen.ref = def.innerType;
	json.default = JSON.parse(JSON.stringify(def.defaultValue));
};
const prefaultProcessor = (schema, ctx$1, json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx$1, params);
	const seen = ctx$1.seen.get(schema);
	seen.ref = def.innerType;
	if (ctx$1.io === "input") json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
};
const catchProcessor = (schema, ctx$1, json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx$1, params);
	const seen = ctx$1.seen.get(schema);
	seen.ref = def.innerType;
	let catchValue;
	try {
		catchValue = def.catchValue(void 0);
	} catch {
		throw new Error("Dynamic catch values are not supported in JSON Schema");
	}
	json.default = catchValue;
};
const pipeProcessor = (schema, ctx$1, _json, params) => {
	const def = schema._zod.def;
	const inIsTransform = def.in._zod.traits.has("$ZodTransform");
	const innerType = ctx$1.io === "input" ? inIsTransform ? def.out : def.in : def.out;
	process(innerType, ctx$1, params);
	const seen = ctx$1.seen.get(schema);
	seen.ref = innerType;
};
const readonlyProcessor = (schema, ctx$1, json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx$1, params);
	const seen = ctx$1.seen.get(schema);
	seen.ref = def.innerType;
	json.readOnly = true;
};
const optionalProcessor = (schema, ctx$1, _json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx$1, params);
	const seen = ctx$1.seen.get(schema);
	seen.ref = def.innerType;
};

//#endregion
//#region node_modules/zod/v4/classic/iso.js
const ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
	$ZodISODateTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function datetime(params) {
	return _isoDateTime(ZodISODateTime, params);
}
const ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
	$ZodISODate.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function date(params) {
	return _isoDate(ZodISODate, params);
}
const ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
	$ZodISOTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function time(params) {
	return _isoTime(ZodISOTime, params);
}
const ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
	$ZodISODuration.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function duration(params) {
	return _isoDuration(ZodISODuration, params);
}

//#endregion
//#region node_modules/zod/v4/classic/errors.js
const initializer = (inst, issues) => {
	$ZodError.init(inst, issues);
	inst.name = "ZodError";
	Object.defineProperties(inst, {
		format: { value: (mapper) => formatError(inst, mapper) },
		flatten: { value: (mapper) => flattenError(inst, mapper) },
		addIssue: { value: (issue$1) => {
			inst.issues.push(issue$1);
			inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
		} },
		addIssues: { value: (issues$1) => {
			inst.issues.push(...issues$1);
			inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
		} },
		isEmpty: { get() {
			return inst.issues.length === 0;
		} }
	});
};
const ZodRealError = /* @__PURE__ */ $constructor("ZodError", initializer, { Parent: Error });

//#endregion
//#region node_modules/zod/v4/classic/parse.js
const parse = /* @__PURE__ */ _parse(ZodRealError);
const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
const encode = /* @__PURE__ */ _encode(ZodRealError);
const decode = /* @__PURE__ */ _decode(ZodRealError);
const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

//#endregion
//#region node_modules/zod/v4/classic/schemas.js
const _installedGroups = /* @__PURE__ */ new WeakMap();
function _installLazyMethods(inst, group, methods) {
	const proto = Object.getPrototypeOf(inst);
	let installed = _installedGroups.get(proto);
	if (!installed) {
		installed = new Set();
		_installedGroups.set(proto, installed);
	}
	if (installed.has(group)) return;
	installed.add(group);
	for (const key in methods) {
		const fn = methods[key];
		Object.defineProperty(proto, key, {
			configurable: true,
			enumerable: false,
			get() {
				const bound = fn.bind(this);
				Object.defineProperty(this, key, {
					configurable: true,
					writable: true,
					enumerable: true,
					value: bound
				});
				return bound;
			},
			set(v) {
				Object.defineProperty(this, key, {
					configurable: true,
					writable: true,
					enumerable: true,
					value: v
				});
			}
		});
	}
}
const ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
	$ZodType.init(inst, def);
	Object.assign(inst["~standard"], { jsonSchema: {
		input: createStandardJSONSchemaMethod(inst, "input"),
		output: createStandardJSONSchemaMethod(inst, "output")
	} });
	inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
	inst.def = def;
	inst.type = def.type;
	Object.defineProperty(inst, "_def", { value: def });
	inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
	inst.safeParse = (data, params) => safeParse(inst, data, params);
	inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
	inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
	inst.spa = inst.safeParseAsync;
	inst.encode = (data, params) => encode(inst, data, params);
	inst.decode = (data, params) => decode(inst, data, params);
	inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
	inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
	inst.safeEncode = (data, params) => safeEncode(inst, data, params);
	inst.safeDecode = (data, params) => safeDecode(inst, data, params);
	inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
	inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
	_installLazyMethods(inst, "ZodType", {
		check(...chks) {
			const def$1 = this.def;
			return this.clone(mergeDefs(def$1, { checks: [...def$1.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
				check: ch,
				def: { check: "custom" },
				onattach: []
			} } : ch)] }), { parent: true });
		},
		with(...chks) {
			return this.check(...chks);
		},
		clone(def$1, params) {
			return clone(this, def$1, params);
		},
		brand() {
			return this;
		},
		register(reg, meta$2) {
			reg.add(this, meta$2);
			return this;
		},
		refine(check, params) {
			return this.check(refine(check, params));
		},
		superRefine(refinement, params) {
			return this.check(superRefine(refinement, params));
		},
		overwrite(fn) {
			return this.check(_overwrite(fn));
		},
		optional() {
			return optional(this);
		},
		exactOptional() {
			return exactOptional(this);
		},
		nullable() {
			return nullable(this);
		},
		nullish() {
			return optional(nullable(this));
		},
		nonoptional(params) {
			return nonoptional(this, params);
		},
		array() {
			return array(this);
		},
		or(arg) {
			return union([this, arg]);
		},
		and(arg) {
			return intersection(this, arg);
		},
		transform(tx) {
			return pipe(this, transform(tx));
		},
		default(d) {
			return _default(this, d);
		},
		prefault(d) {
			return prefault(this, d);
		},
		catch(params) {
			return _catch(this, params);
		},
		pipe(target) {
			return pipe(this, target);
		},
		readonly() {
			return readonly(this);
		},
		describe(description) {
			const cl = this.clone();
			globalRegistry.add(cl, { description });
			return cl;
		},
		meta(...args) {
			if (args.length === 0) return globalRegistry.get(this);
			const cl = this.clone();
			globalRegistry.add(cl, args[0]);
			return cl;
		},
		isOptional() {
			return this.safeParse(void 0).success;
		},
		isNullable() {
			return this.safeParse(null).success;
		},
		apply(fn) {
			return fn(this);
		}
	});
	Object.defineProperty(inst, "description", {
		get() {
			return globalRegistry.get(inst)?.description;
		},
		configurable: true
	});
	return inst;
});
/** @internal */
const _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => stringProcessor(inst, ctx$1, json, params);
	const bag = inst._zod.bag;
	inst.format = bag.format ?? null;
	inst.minLength = bag.minimum ?? null;
	inst.maxLength = bag.maximum ?? null;
	_installLazyMethods(inst, "_ZodString", {
		regex(...args) {
			return this.check(_regex(...args));
		},
		includes(...args) {
			return this.check(_includes(...args));
		},
		startsWith(...args) {
			return this.check(_startsWith(...args));
		},
		endsWith(...args) {
			return this.check(_endsWith(...args));
		},
		min(...args) {
			return this.check(_minLength(...args));
		},
		max(...args) {
			return this.check(_maxLength(...args));
		},
		length(...args) {
			return this.check(_length(...args));
		},
		nonempty(...args) {
			return this.check(_minLength(1, ...args));
		},
		lowercase(params) {
			return this.check(_lowercase(params));
		},
		uppercase(params) {
			return this.check(_uppercase(params));
		},
		trim() {
			return this.check(_trim());
		},
		normalize(...args) {
			return this.check(_normalize(...args));
		},
		toLowerCase() {
			return this.check(_toLowerCase());
		},
		toUpperCase() {
			return this.check(_toUpperCase());
		},
		slugify() {
			return this.check(_slugify());
		}
	});
});
const ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	_ZodString.init(inst, def);
	inst.email = (params) => inst.check(_email(ZodEmail, params));
	inst.url = (params) => inst.check(_url(ZodURL, params));
	inst.jwt = (params) => inst.check(_jwt(ZodJWT, params));
	inst.emoji = (params) => inst.check(_emoji(ZodEmoji, params));
	inst.guid = (params) => inst.check(_guid(ZodGUID, params));
	inst.uuid = (params) => inst.check(_uuid(ZodUUID, params));
	inst.uuidv4 = (params) => inst.check(_uuidv4(ZodUUID, params));
	inst.uuidv6 = (params) => inst.check(_uuidv6(ZodUUID, params));
	inst.uuidv7 = (params) => inst.check(_uuidv7(ZodUUID, params));
	inst.nanoid = (params) => inst.check(_nanoid(ZodNanoID, params));
	inst.guid = (params) => inst.check(_guid(ZodGUID, params));
	inst.cuid = (params) => inst.check(_cuid(ZodCUID, params));
	inst.cuid2 = (params) => inst.check(_cuid2(ZodCUID2, params));
	inst.ulid = (params) => inst.check(_ulid(ZodULID, params));
	inst.base64 = (params) => inst.check(_base64(ZodBase64, params));
	inst.base64url = (params) => inst.check(_base64url(ZodBase64URL, params));
	inst.xid = (params) => inst.check(_xid(ZodXID, params));
	inst.ksuid = (params) => inst.check(_ksuid(ZodKSUID, params));
	inst.ipv4 = (params) => inst.check(_ipv4(ZodIPv4, params));
	inst.ipv6 = (params) => inst.check(_ipv6(ZodIPv6, params));
	inst.cidrv4 = (params) => inst.check(_cidrv4(ZodCIDRv4, params));
	inst.cidrv6 = (params) => inst.check(_cidrv6(ZodCIDRv6, params));
	inst.e164 = (params) => inst.check(_e164(ZodE164, params));
	inst.datetime = (params) => inst.check(datetime(params));
	inst.date = (params) => inst.check(date(params));
	inst.time = (params) => inst.check(time(params));
	inst.duration = (params) => inst.check(duration(params));
});
function string(params) {
	return _string(ZodString, params);
}
const ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	_ZodString.init(inst, def);
});
const ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
	$ZodEmail.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
	$ZodGUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
	$ZodUUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
	$ZodURL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
	$ZodEmoji.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
	$ZodNanoID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
* See https://github.com/paralleldrive/cuid.
*/
const ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
	$ZodCUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
	$ZodCUID2.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
	$ZodULID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
	$ZodXID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
	$ZodKSUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
	$ZodIPv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
	$ZodIPv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
	$ZodCIDRv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
	$ZodCIDRv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
	$ZodBase64.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
	$ZodBase64URL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
	$ZodE164.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
	$ZodJWT.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodNumber = /* @__PURE__ */ $constructor("ZodNumber", (inst, def) => {
	$ZodNumber.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => numberProcessor(inst, ctx$1, json, params);
	_installLazyMethods(inst, "ZodNumber", {
		gt(value, params) {
			return this.check(_gt(value, params));
		},
		gte(value, params) {
			return this.check(_gte(value, params));
		},
		min(value, params) {
			return this.check(_gte(value, params));
		},
		lt(value, params) {
			return this.check(_lt(value, params));
		},
		lte(value, params) {
			return this.check(_lte(value, params));
		},
		max(value, params) {
			return this.check(_lte(value, params));
		},
		int(params) {
			return this.check(int(params));
		},
		safe(params) {
			return this.check(int(params));
		},
		positive(params) {
			return this.check(_gt(0, params));
		},
		nonnegative(params) {
			return this.check(_gte(0, params));
		},
		negative(params) {
			return this.check(_lt(0, params));
		},
		nonpositive(params) {
			return this.check(_lte(0, params));
		},
		multipleOf(value, params) {
			return this.check(_multipleOf(value, params));
		},
		step(value, params) {
			return this.check(_multipleOf(value, params));
		},
		finite() {
			return this;
		}
	});
	const bag = inst._zod.bag;
	inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
	inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
	inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
	inst.isFinite = true;
	inst.format = bag.format ?? null;
});
function number(params) {
	return _number(ZodNumber, params);
}
const ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
	$ZodNumberFormat.init(inst, def);
	ZodNumber.init(inst, def);
});
function int(params) {
	return _int(ZodNumberFormat, params);
}
const ZodBoolean = /* @__PURE__ */ $constructor("ZodBoolean", (inst, def) => {
	$ZodBoolean.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => booleanProcessor(inst, ctx$1, json, params);
});
function boolean(params) {
	return _boolean(ZodBoolean, params);
}
const ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
	$ZodUnknown.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => unknownProcessor(inst, ctx$1, json, params);
});
function unknown() {
	return _unknown(ZodUnknown);
}
const ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
	$ZodNever.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => neverProcessor(inst, ctx$1, json, params);
});
function never(params) {
	return _never(ZodNever, params);
}
const ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
	$ZodArray.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => arrayProcessor(inst, ctx$1, json, params);
	inst.element = def.element;
	_installLazyMethods(inst, "ZodArray", {
		min(n, params) {
			return this.check(_minLength(n, params));
		},
		nonempty(params) {
			return this.check(_minLength(1, params));
		},
		max(n, params) {
			return this.check(_maxLength(n, params));
		},
		length(n, params) {
			return this.check(_length(n, params));
		},
		unwrap() {
			return this.element;
		}
	});
});
function array(element, params) {
	return _array(ZodArray, element, params);
}
const ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
	$ZodObjectJIT.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => objectProcessor(inst, ctx$1, json, params);
	defineLazy(inst, "shape", () => {
		return def.shape;
	});
	_installLazyMethods(inst, "ZodObject", {
		keyof() {
			return _enum(Object.keys(this._zod.def.shape));
		},
		catchall(catchall) {
			return this.clone({
				...this._zod.def,
				catchall
			});
		},
		passthrough() {
			return this.clone({
				...this._zod.def,
				catchall: unknown()
			});
		},
		loose() {
			return this.clone({
				...this._zod.def,
				catchall: unknown()
			});
		},
		strict() {
			return this.clone({
				...this._zod.def,
				catchall: never()
			});
		},
		strip() {
			return this.clone({
				...this._zod.def,
				catchall: void 0
			});
		},
		extend(incoming) {
			return extend(this, incoming);
		},
		safeExtend(incoming) {
			return safeExtend(this, incoming);
		},
		merge(other) {
			return merge(this, other);
		},
		pick(mask) {
			return pick(this, mask);
		},
		omit(mask) {
			return omit(this, mask);
		},
		partial(...args) {
			return partial(ZodOptional, this, args[0]);
		},
		required(...args) {
			return required(ZodNonOptional, this, args[0]);
		}
	});
});
function object(shape, params) {
	const def = {
		type: "object",
		shape: shape ?? {},
		...normalizeParams(params)
	};
	return new ZodObject(def);
}
const ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
	$ZodUnion.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => unionProcessor(inst, ctx$1, json, params);
	inst.options = def.options;
});
function union(options, params) {
	return new ZodUnion({
		type: "union",
		options,
		...normalizeParams(params)
	});
}
const ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
	$ZodIntersection.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => intersectionProcessor(inst, ctx$1, json, params);
});
function intersection(left, right) {
	return new ZodIntersection({
		type: "intersection",
		left,
		right
	});
}
const ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
	$ZodEnum.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => enumProcessor(inst, ctx$1, json, params);
	inst.enum = def.entries;
	inst.options = Object.values(def.entries);
	const keys = new Set(Object.keys(def.entries));
	inst.extract = (values, params) => {
		const newEntries = {};
		for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
	inst.exclude = (values, params) => {
		const newEntries = { ...def.entries };
		for (const value of values) if (keys.has(value)) delete newEntries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
});
function _enum(values, params) {
	const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
	return new ZodEnum({
		type: "enum",
		entries,
		...normalizeParams(params)
	});
}
const ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def) => {
	$ZodLiteral.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => literalProcessor(inst, ctx$1, json, params);
	inst.values = new Set(def.values);
	Object.defineProperty(inst, "value", { get() {
		if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
		return def.values[0];
	} });
});
function literal(value, params) {
	return new ZodLiteral({
		type: "literal",
		values: Array.isArray(value) ? value : [value],
		...normalizeParams(params)
	});
}
const ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
	$ZodTransform.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => transformProcessor(inst, ctx$1, json, params);
	inst._zod.parse = (payload, _ctx) => {
		if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		payload.addIssue = (issue$1) => {
			if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
			else {
				const _issue = issue$1;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				_issue.input ?? (_issue.input = payload.value);
				_issue.inst ?? (_issue.inst = inst);
				payload.issues.push(issue(_issue));
			}
		};
		const output = def.transform(payload.value, payload);
		if (output instanceof Promise) return output.then((output$1) => {
			payload.value = output$1;
			payload.fallback = true;
			return payload;
		});
		payload.value = output;
		payload.fallback = true;
		return payload;
	};
});
function transform(fn) {
	return new ZodTransform({
		type: "transform",
		transform: fn
	});
}
const ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => optionalProcessor(inst, ctx$1, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
	return new ZodOptional({
		type: "optional",
		innerType
	});
}
const ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
	$ZodExactOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => optionalProcessor(inst, ctx$1, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
	return new ZodExactOptional({
		type: "optional",
		innerType
	});
}
const ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
	$ZodNullable.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => nullableProcessor(inst, ctx$1, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
	return new ZodNullable({
		type: "nullable",
		innerType
	});
}
const ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
	$ZodDefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => defaultProcessor(inst, ctx$1, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
	return new ZodDefault({
		type: "default",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
const ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
	$ZodPrefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => prefaultProcessor(inst, ctx$1, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
	return new ZodPrefault({
		type: "prefault",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
const ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
	$ZodNonOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => nonoptionalProcessor(inst, ctx$1, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
	return new ZodNonOptional({
		type: "nonoptional",
		innerType,
		...normalizeParams(params)
	});
}
const ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
	$ZodCatch.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => catchProcessor(inst, ctx$1, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
	return new ZodCatch({
		type: "catch",
		innerType,
		catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
	});
}
const ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
	$ZodPipe.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => pipeProcessor(inst, ctx$1, json, params);
	inst.in = def.in;
	inst.out = def.out;
});
function pipe(in_, out) {
	return new ZodPipe({
		type: "pipe",
		in: in_,
		out
	});
}
const ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
	$ZodReadonly.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => readonlyProcessor(inst, ctx$1, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
	return new ZodReadonly({
		type: "readonly",
		innerType
	});
}
const ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
	$ZodCustom.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx$1, json, params) => customProcessor(inst, ctx$1, json, params);
});
function refine(fn, _params = {}) {
	return _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
	return _superRefine(fn, params);
}
const describe = describe$1;
const meta = meta$1;

//#endregion
//#region src/client/remote.ts
const req_fsList = object({
	root: string(),
	path: string(),
	showHidden: boolean().optional()
});
const res_fsList = object({ entries: array(object({
	name: string(),
	isDirectory: boolean(),
	size: number()
})) });
const req_fsRead = object({
	root: string(),
	path: string()
});
const res_fsRead = object({ content: string() });
const req_fsWrite = object({
	root: string(),
	path: string(),
	content: string()
});
const res_fsWrite = object({ path: string() });
const req_fsCreateFile = object({
	root: string(),
	path: string()
});
const res_fsCreateFile = object({ path: string() });
const req_fsCreateDir = object({
	root: string(),
	path: string()
});
const res_fsCreateDir = object({ path: string() });
const req_fsRename = object({
	root: string(),
	path: string(),
	newName: string()
});
const res_fsRename = object({ path: string() });
const req_fsDelete = object({
	root: string(),
	path: string()
});
const res_fsDelete = object({ path: string() });
const req_gitStatus = object({
	root: string(),
	repoPath: string()
});
const res_gitStatus = object({
	branch: string(),
	dirtyCount: number(),
	changes: array(object({
		path: string(),
		status: union([
			literal("M"),
			literal("A"),
			literal("D"),
			literal("U")
		])
	}))
});
const req_gitCheckout = object({
	root: string(),
	repoPath: string(),
	branch: string()
});
const res_gitCheckout = object({ output: string() });
const req_gitCreateBranch = object({
	root: string(),
	repoPath: string(),
	name: string()
});
const res_gitCreateBranch = object({ output: string() });
const req_gitPull = object({
	root: string(),
	repoPath: string()
});
const res_gitPull = object({ output: string() });
const req_chat = object({
	messages: array(object({
		role: union([
			literal("system"),
			literal("user"),
			literal("assistant")
		]),
		content: string()
	})),
	model: string(),
	apiBase: string(),
	apiKey: string()
});
const res_chat = object({ content: string() });
const req_qqList = object({});
const res_qqList = object({ sessions: array(object({
	key: string(),
	peerId: string(),
	kind: union([literal("group"), literal("c2c")]),
	messages: array(object({
		role: union([literal("user"), literal("assistant")]),
		content: string()
	})),
	updatedAt: number()
})) });
const req_qqRead = object({ key: string() });
const res_qqRead = object({ session: unknown().optional() });
const req_qqSend = object({
	key: string(),
	content: string()
});
const res_qqSend = object({ ok: boolean() });
const TYPERT_REMOTE = {
	package: "dsh-shiningweb-ui",
	descriptors: [
		{
			id: "dsh-shiningweb-ui#shining/fsList",
			service: "shining",
			namespace: "shining",
			method: "fsList",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#fsListRequest",
					schema: req_fsList
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#fsListResult",
				schema: res_fsList
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/fsRead",
			service: "shining",
			namespace: "shining",
			method: "fsRead",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#fsReadRequest",
					schema: req_fsRead
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#fsReadResult",
				schema: res_fsRead
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/fsWrite",
			service: "shining",
			namespace: "shining",
			method: "fsWrite",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#fsWriteRequest",
					schema: req_fsWrite
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#fsWriteResult",
				schema: res_fsWrite
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/fsCreateFile",
			service: "shining",
			namespace: "shining",
			method: "fsCreateFile",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#fsCreateFileRequest",
					schema: req_fsCreateFile
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#fsCreateFileResult",
				schema: res_fsCreateFile
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/fsCreateDir",
			service: "shining",
			namespace: "shining",
			method: "fsCreateDir",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#fsCreateDirRequest",
					schema: req_fsCreateDir
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#fsCreateDirResult",
				schema: res_fsCreateDir
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/fsRename",
			service: "shining",
			namespace: "shining",
			method: "fsRename",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#fsRenameRequest",
					schema: req_fsRename
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#fsRenameResult",
				schema: res_fsRename
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/fsDelete",
			service: "shining",
			namespace: "shining",
			method: "fsDelete",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#fsDeleteRequest",
					schema: req_fsDelete
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#fsDeleteResult",
				schema: res_fsDelete
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/gitStatus",
			service: "shining",
			namespace: "shining",
			method: "gitStatus",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#gitStatusRequest",
					schema: req_gitStatus
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#gitStatusResult",
				schema: res_gitStatus
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/gitCheckout",
			service: "shining",
			namespace: "shining",
			method: "gitCheckout",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#gitCheckoutRequest",
					schema: req_gitCheckout
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#gitCheckoutResult",
				schema: res_gitCheckout
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/gitCreateBranch",
			service: "shining",
			namespace: "shining",
			method: "gitCreateBranch",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#gitCreateBranchRequest",
					schema: req_gitCreateBranch
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#gitCreateBranchResult",
				schema: res_gitCreateBranch
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/gitPull",
			service: "shining",
			namespace: "shining",
			method: "gitPull",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#gitPullRequest",
					schema: req_gitPull
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#gitPullResult",
				schema: res_gitPull
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/chat",
			service: "shining",
			namespace: "shining",
			method: "chat",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#chatRequest",
					schema: req_chat
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#chatResult",
				schema: res_chat
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/qqList",
			service: "shining",
			namespace: "shining",
			method: "qqList",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#qqListRequest",
					schema: req_qqList
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#qqListResult",
				schema: res_qqList
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/qqRead",
			service: "shining",
			namespace: "shining",
			method: "qqRead",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#qqReadRequest",
					schema: req_qqRead
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#qqReadResult",
				schema: res_qqRead
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/qqSend",
			service: "shining",
			namespace: "shining",
			method: "qqSend",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#qqSendRequest",
					schema: req_qqSend
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#qqSendResult",
				schema: res_qqSend
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		}
	]
};
var remote_default = TYPERT_REMOTE;

//#endregion
//#region src/client/remote-types.ts
let shiningRemote;
const remoteListeners = new Set();
/** apply 挂载 remote 后绑定实例（mount 失败时 undefined，组件优雅降级）。 */
function setShiningRemote(r) {
	shiningRemote = r;
	for (const l of remoteListeners) l();
}
/** 组件读取当前 remote 实例（apply 后即稳定）。 */
function getShiningRemote() {
	return shiningRemote;
}
/** 响应式读 remote 实例（apply 挂载后变化一次，供组件订阅避免初渲染读到 undefined）。 */
function useShiningRemote() {
	return (0, react.useSyncExternalStore)((l) => {
		remoteListeners.add(l);
		return () => {
			remoteListeners.delete(l);
		};
	}, () => shiningRemote);
}

//#endregion
//#region src/client/dsh-context.ts
let ctx;
const listeners$1 = new Set();
let cached = {
	workspaces: [],
	sessions: [],
	currentSessionId: void 0
};
let version = 0;
/** apply 时绑定 DSH 客户端上下文。 */
function bindDshCtx(c) {
	ctx = c;
}
function emit$1() {
	version += 1;
	cached = gatherDshContext();
	for (const l of listeners$1) l();
}
/** 订阅 workspaces + sessions 列表变化（供 useDshContext 响应式）。 */
function subscribe(l) {
	listeners$1.add(l);
	ctx?.workspaces.list.subscribe(emit$1);
	ctx?.sessions.list.subscribe(emit$1);
	return () => {
		listeners$1.delete(l);
	};
}
/** 同步聚合 DSH 概况（工作区/会话/当前会话）。 */
function gatherDshContext() {
	if (!ctx) return {
		workspaces: [],
		sessions: [],
		currentSessionId: void 0
	};
	const workspaces = ctx.workspaces.list.getSnapshot().items.map((w) => ({
		id: w.workspaceId,
		title: w.title,
		path: w.path
	}));
	const list = ctx.sessions.list.getSnapshot();
	const currentSessionId = list.current;
	const sessions = list.ids.map((id) => {
		const s = list.byId[id];
		return {
			id,
			title: s?.displayTitle ?? String(id),
			cwd: s?.cwd
		};
	});
	return {
		workspaces,
		sessions,
		currentSessionId
	};
}
/** 响应式读 DSH 概况（快照缓存，仅在列表变化时重算）。 */
function useDshContext() {
	return (0, react.useSyncExternalStore)(subscribe, () => cached);
}
/** 把 DSH 概况格式化为 model 上下文块（注入独立模型 system prompt）。 */
function dshContextToText(c) {
	const lines = ["【DSH 主窗口概况】"];
	if (c.workspaces.length) lines.push(`项目：${c.workspaces.map((w) => w.title).join("、")}`);
	if (c.sessions.length) lines.push(`会话：${c.sessions.map((s) => s.title).join("、")}`);
	if (c.currentSessionId) {
		const cur = c.sessions.find((s) => s.id === c.currentSessionId);
		lines.push(`当前会话：${cur?.title ?? "（无标题）"}`);
	}
	if (c.workspaces.length || c.sessions.length) return lines.join("\n");
	return "";
}
/**
* 代发：把一段内容作为"一轮"送进指定 DSH 会话（主 agent 处理）。
* @param sessionId - 目标会话。
* @param text - 任务内容。
*/
async function sendToSession(sessionId, text) {
	const binding = ctx?.sessions.binding(sessionId);
	if (!binding) return false;
	const res = await binding.session.prompt([{
		type: "text",
		text
	}], "queue");
	return res.ok === true;
}
/** 当前会话 id（异步绑定场景兜底）。 */
function getCurrentSessionId() {
	return ctx?.sessions.list.getSnapshot().current;
}

//#endregion
//#region src/client/workspace.ts
/**
* 解析“当前”工作区根路径：优先 most-recently-active 工作区（recentWorkspaceId），
* 缺失或未命中时回退到列表首项。避免多工作区时把 items[0]（显示顺序首项）
* 当成当前仓库，导致 Git 分支读到错误仓库。
*/
function resolveCurrentWorkspaceRoot(state$1) {
	const items = state$1?.items ?? [];
	const recent = state$1?.recentWorkspaceId;
	if (recent) {
		const found = items.find((w) => w.workspaceId === recent);
		if (found) return found.path;
	}
	return items[0]?.path ?? "";
}
let root = "";
const rootListeners = new Set();
let openPathFn;
function notifyRoot() {
	for (const l of rootListeners) l();
}
function setWorkspaceRoot(r) {
	if (r === root) return;
	root = r;
	notifyRoot();
}
function getWorkspaceRoot() {
	return root;
}
/** 响应式读工作区根路径（变化时触发组件重渲染，供 GitManager 等订阅）。 */
function useWorkspaceRoot() {
	return (0, react.useSyncExternalStore)((l) => {
		rootListeners.add(l);
		return () => {
			rootListeners.delete(l);
		};
	}, () => root);
}
function setOpenPath(fn) {
	openPathFn = fn;
}
function getOpenPath() {
	return openPathFn;
}

//#endregion
//#region src/client/store.ts
let state = {
	chatOpen: false,
	filesOpen: false
};
const listeners = new Set();
function emit() {
	for (const l of listeners) l();
}
function set(next) {
	state = {
		...state,
		...next
	};
	emit();
}
function useShiningStore() {
	return (0, react.useSyncExternalStore)((l) => {
		listeners.add(l);
		return () => {
			listeners.delete(l);
		};
	}, () => state);
}
function openChat() {
	set({ chatOpen: true });
}
function closeChat() {
	set({ chatOpen: false });
}
function openFiles() {
	set({ filesOpen: true });
}
function closeFiles() {
	set({ filesOpen: false });
}

//#endregion
//#region \0dsh-css:F:\余程安学习资料\dsh-shiningweb-ui\src\client\components\SidebarEntry.module.css.mjs
const css$6 = ".tSXlGa_entry{width:100%;color:var(--dsw-alias-label-primary);cursor:pointer;font:inherit;text-align:left;background:0 0;border:0;align-items:center;gap:8px;padding:6px 10px;display:flex}.tSXlGa_entry:hover{background:var(--shining-soft,var(--dsw-alias-interactive-bg-hover))}.tSXlGa_icon{color:var(--shining-accent);flex:none}.tSXlGa_label{font-size:13px}";
const tagId$6 = "dsh-shiningweb-ui/SidebarEntry.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$6) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-shiningweb-ui";
	tag.dataset.pluginCss = tagId$6;
	tag.textContent = css$6;
	document.head.appendChild(tag);
}
var SidebarEntry_module_css_default = {
	"entry": "tSXlGa_entry",
	"icon": "tSXlGa_icon",
	"label": "tSXlGa_label"
};

//#endregion
//#region src/client/components/SidebarEntry.tsx
/** 天圆地方入口按钮（拱门图标）。 */
function ChatEntry(props) {
	const settings = useSettings();
	if (!settings.enabled || !settings.chat.enabled) return null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
		type: "button",
		className: SidebarEntry_module_css_default.entry,
		onClick: openChat,
		"aria-label": dict.zh.entryChat,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
			className: SidebarEntry_module_css_default.icon,
			width: "16",
			height: "16",
			viewBox: "0 0 24 24",
			fill: "none",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
				d: "M4 20h16M6 20V9a6 6 0 0 1 12 0v11",
				stroke: "currentColor",
				strokeWidth: "1.6"
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
				d: "M6 14h12",
				stroke: "currentColor",
				strokeWidth: "1.6"
			})]
		}), props.wide ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: SidebarEntry_module_css_default.label,
			children: dict.zh.entryChat
		}) : null]
	});
}
/** 文件栏入口按钮。 */
function FilesEntry(props) {
	const settings = useSettings();
	if (!settings.enabled || !settings.fileExplorer.enabled) return null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
		type: "button",
		className: SidebarEntry_module_css_default.entry,
		onClick: openFiles,
		"aria-label": dict.zh.entryFiles,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
			className: SidebarEntry_module_css_default.icon,
			width: "16",
			height: "16",
			viewBox: "0 0 24 24",
			fill: "none",
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
				d: "M3 6h7l2 2h9v11H3z",
				stroke: "currentColor",
				strokeWidth: "1.6"
			})
		}), props.wide ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: SidebarEntry_module_css_default.label,
			children: dict.zh.entryFiles
		}) : null]
	});
}

//#endregion
//#region src/client/storage.ts
/**
* 本地存储：IndexedDB（聊天历史）+ localStorage（立绘/背景，限尺寸）。
*/
const DB = "shining-chat";
const STORE = "history";
function openDb$1() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB, 1);
		req.onupgradeneeded = () => {
			req.result.createObjectStore(STORE, { keyPath: "id" });
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
/** 保存一次会话历史（按 id 覆盖）。 */
async function saveChat(rec) {
	const db = await openDb$1();
	const tx = db.transaction(STORE, "readwrite");
	tx.objectStore(STORE).put(rec);
	await new Promise((res, rej) => {
		tx.oncomplete = () => res();
		tx.onerror = () => rej(tx.error);
	});
}
/** 读取指定角色最近一次会话。 */
async function loadChat(personaId) {
	const db = await openDb$1();
	return new Promise((res, rej) => {
		const all = db.transaction(STORE).objectStore(STORE).getAll();
		all.onsuccess = () => {
			const list = all.result.filter((r) => r.personaId === personaId).sort((a, b) => b.updatedAt - a.updatedAt);
			res(list[0]);
		};
		all.onerror = () => rej(all.error);
	});
}
/** 立绘图片（Base64 DataURL）存取，限 2MB。 */
const IMG_KEY = "shining:image";
function setImage(dataUrl) {
	localStorage.setItem(IMG_KEY, dataUrl);
}
function getImage() {
	return localStorage.getItem(IMG_KEY);
}
function clearImage() {
	localStorage.removeItem(IMG_KEY);
}
/** 压缩图片到最大 1024px，JPEG 0.8，仍超 2MB 则拒绝。 */
async function compressImage(file) {
	const dataUrl = await readDataUrl(file);
	const img = await loadImage(dataUrl);
	const max = 1024;
	const scale = Math.min(1, max / Math.max(img.width, img.height));
	const canvas = document.createElement("canvas");
	canvas.width = Math.max(1, Math.round(img.width * scale));
	canvas.height = Math.max(1, Math.round(img.height * scale));
	const ctx$1 = canvas.getContext("2d");
	if (!ctx$1) throw new Error("canvas unavailable");
	ctx$1.drawImage(img, 0, 0, canvas.width, canvas.height);
	const out = canvas.toDataURL("image/jpeg", .8);
	if (out.length > 2 * 1024 * 1024) throw new Error("image too large (>2MB)");
	return out;
}
function readDataUrl(file) {
	return new Promise((res, rej) => {
		const r = new FileReader();
		r.onload = () => res(String(r.result));
		r.onerror = () => rej(r.error);
		r.readAsDataURL(file);
	});
}
function loadImage(src) {
	return new Promise((res, rej) => {
		const img = new Image();
		img.onload = () => res(img);
		img.onerror = () => rej(new Error("image load failed"));
		img.src = src;
	});
}
const MEM_DB = "shining-memory";
const MEM_STORE = "memory";
function openMemDb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(MEM_DB, 1);
		req.onupgradeneeded = () => {
			req.result.createObjectStore(MEM_STORE, { keyPath: "id" });
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
/** 读取天圆地方自持记忆（倒序，最多 limit 条）。 */
async function listMemoryNotes(limit = 10) {
	const db = await openMemDb();
	return new Promise((res, rej) => {
		const rq = db.transaction(MEM_STORE).objectStore(MEM_STORE).getAll();
		rq.onsuccess = () => res(rq.result.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit));
		rq.onerror = () => rej(rq.error);
	});
}

//#endregion
//#region src/client/hooks/useChat.ts
function useChat(personaId, remote, settings) {
	const [rec, setRec] = (0, react.useState)(null);
	const [busy, setBusy] = (0, react.useState)(false);
	(0, react.useEffect)(() => {
		let alive = true;
		loadChat(personaId).then((r) => {
			if (alive) setRec(r ?? null);
		});
		return () => {
			alive = false;
		};
	}, [personaId]);
	const send = (0, react.useCallback)(async (text, contextText) => {
		if (busy || !text.trim() || !remote) return;
		setBusy(true);
		try {
			const base = rec?.messages ?? [];
			const userMsg = {
				role: "user",
				content: text.trim()
			};
			const withUser = [...base, userMsg];
			const nextRec = {
				id: rec?.id ?? `${personaId}-${Date.now()}`,
				personaId,
				messages: withUser,
				updatedAt: Date.now()
			};
			await saveChat(nextRec);
			setRec(nextRec);
			const modelMessages = contextText ? [{
				role: "system",
				content: contextText
			}, ...withUser] : withUser;
			const res = await remote.chat({
				messages: modelMessages,
				model: settings.chat.model,
				apiBase: settings.chat.apiBase,
				apiKey: settings.chat.apiKey
			});
			const content = res.ok ? res.value.content : res.error?.message ?? "请求失败";
			const finalRec = {
				...nextRec,
				messages: [...withUser, {
					role: "assistant",
					content
				}],
				updatedAt: Date.now()
			};
			await saveChat(finalRec);
			setRec(finalRec);
		} finally {
			setBusy(false);
		}
	}, [
		busy,
		rec,
		remote,
		settings.chat,
		personaId
	]);
	return {
		rec,
		busy,
		send
	};
}

//#endregion
//#region src/client/friend-circle.ts
/** 天圆地方朋友圈：动态/点赞/评论（IndexedDB）。 */
const FC_DB = "shining-friend-circle";
const FC_STORE = "posts";
function openDb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(FC_DB, 1);
		req.onupgradeneeded = () => {
			req.result.createObjectStore(FC_STORE, { keyPath: "id" });
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
/** 发布一条动态。 */
async function addPost(personaId, content) {
	const db = await openDb();
	const post = {
		id: `post-${Date.now()}`,
		personaId,
		content,
		createdAt: Date.now(),
		likes: [],
		comments: []
	};
	const tx = db.transaction(FC_STORE, "readwrite");
	tx.objectStore(FC_STORE).put(post);
	await new Promise((res, rej) => {
		tx.oncomplete = () => res();
		tx.onerror = () => rej(tx.error);
	});
}
/** 列出某角色的全部动态（倒序）。 */
async function listPosts(personaId) {
	const db = await openDb();
	return new Promise((res, rej) => {
		const rq = db.transaction(FC_STORE).objectStore(FC_STORE).getAll();
		rq.onsuccess = () => res(rq.result.filter((p) => p.personaId === personaId).sort((a, b) => b.createdAt - a.createdAt));
		rq.onerror = () => rej(rq.error);
	});
}
/** 点赞/取消点赞（toggle）。 */
async function toggleLike(postId, liker) {
	const db = await openDb();
	const rq = db.transaction(FC_STORE).objectStore(FC_STORE).get(postId);
	const post = await new Promise((res, rej) => {
		rq.onsuccess = () => res(rq.result);
		rq.onerror = () => rej(rq.error);
	});
	if (!post) return;
	const likes = post.likes.includes(liker) ? post.likes.filter((l) => l !== liker) : [...post.likes, liker];
	await putPost(db, {
		...post,
		likes
	});
}
async function putPost(db, post) {
	const tx = db.transaction(FC_STORE, "readwrite");
	tx.objectStore(FC_STORE).put(post);
	await new Promise((res, rej) => {
		tx.oncomplete = () => res();
		tx.onerror = () => rej(tx.error);
	});
}

//#endregion
//#region \0dsh-css:F:\余程安学习资料\dsh-shiningweb-ui\src\client\components\FriendCircle.module.css.mjs
const css$5 = ".kCIwiW_wrap{flex-direction:column;flex:1;gap:12px;padding:16px;display:flex;overflow-y:auto}.kCIwiW_composer{gap:8px;display:flex}.kCIwiW_textarea{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);min-height:64px;color:var(--dsw-alias-label-primary);resize:vertical;border-radius:8px;flex:1;padding:8px}.kCIwiW_textarea:focus{border-color:var(--shining-primary);box-shadow:0 0 0 2px var(--shining-glow);outline:none}.kCIwiW_publish{background:var(--shining-gradient,var(--shining-primary));color:#fff;cursor:pointer;border:0;border-radius:8px;align-self:flex-start;padding:8px 16px}.kCIwiW_list{flex-direction:column;gap:12px;margin:0;padding:0;list-style:none;display:flex}.kCIwiW_post{border:1px solid var(--shining-border,var(--dsw-alias-border-l2));background:var(--dsw-alias-bg-module-platform);border-radius:12px;padding:12px}.kCIwiW_content{margin:0 0 8px}.kCIwiW_meta{color:var(--dsw-alias-label-secondary);align-items:center;gap:8px;font-size:12px;display:flex}.kCIwiW_time{flex:1}.kCIwiW_action{cursor:pointer;color:var(--dsw-alias-label-primary);font:inherit;background:0 0;border:0}.kCIwiW_comments{flex-direction:column;gap:4px;margin:8px 0 0;padding:0;font-size:13px;list-style:none;display:flex}.kCIwiW_comment{color:var(--dsw-alias-label-secondary)}.kCIwiW_empty{color:var(--dsw-alias-label-secondary);font-size:13px}";
const tagId$5 = "dsh-shiningweb-ui/FriendCircle.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$5) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-shiningweb-ui";
	tag.dataset.pluginCss = tagId$5;
	tag.textContent = css$5;
	document.head.appendChild(tag);
}
var FriendCircle_module_css_default = {
	"action": "kCIwiW_action",
	"comment": "kCIwiW_comment",
	"comments": "kCIwiW_comments",
	"composer": "kCIwiW_composer",
	"content": "kCIwiW_content",
	"empty": "kCIwiW_empty",
	"list": "kCIwiW_list",
	"meta": "kCIwiW_meta",
	"post": "kCIwiW_post",
	"publish": "kCIwiW_publish",
	"textarea": "kCIwiW_textarea",
	"time": "kCIwiW_time",
	"wrap": "kCIwiW_wrap"
};

//#endregion
//#region src/client/components/FriendCircle.tsx
function FriendCircle(props) {
	const [posts, setPosts] = (0, react.useState)([]);
	const [draft, setDraft] = (0, react.useState)("");
	const refresh = () => {
		listPosts(props.personaId).then(setPosts);
	};
	(0, react.useEffect)(() => {
		refresh();
	}, [props.personaId]);
	const publish = async () => {
		if (!draft.trim()) return;
		await addPost(props.personaId, draft.trim());
		setDraft("");
		refresh();
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: FriendCircle_module_css_default.wrap,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: FriendCircle_module_css_default.composer,
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
				className: FriendCircle_module_css_default.textarea,
				value: draft,
				onChange: (e) => setDraft(e.target.value),
				placeholder: "这一刻的想法…"
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				className: FriendCircle_module_css_default.publish,
				onClick: () => void publish(),
				disabled: !draft.trim(),
				children: "发表"
			})]
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("ul", {
			className: FriendCircle_module_css_default.list,
			children: [posts.map((p) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
				className: FriendCircle_module_css_default.post,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: FriendCircle_module_css_default.content,
						children: p.content
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: FriendCircle_module_css_default.meta,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: FriendCircle_module_css_default.time,
							children: new Date(p.createdAt).toLocaleString()
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							className: FriendCircle_module_css_default.action,
							onClick: () => void toggleLike(p.id, "me").then(refresh),
							children: ["赞 ", p.likes.length]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
						className: FriendCircle_module_css_default.comments,
						children: p.comments.map((c) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
							className: FriendCircle_module_css_default.comment,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("b", { children: [c.author, "："] }), c.content]
						}, c.id))
					})
				]
			}, p.id)), posts.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", {
				className: FriendCircle_module_css_default.empty,
				children: "还没有动态"
			}) : null]
		})]
	});
}

//#endregion
//#region \0dsh-css:F:\余程安学习资料\dsh-shiningweb-ui\src\client\components\QqSessions.module.css.mjs
const css$4 = ".Aci1na_wrap{flex-direction:column;flex:1;gap:12px;padding:16px;display:flex;overflow-y:auto}.Aci1na_refresh{border:1px solid var(--shining-border,var(--dsw-alias-border-l2));cursor:pointer;color:var(--shining-primary);font:inherit;background:0 0;border-radius:6px;align-self:flex-start;padding:4px 12px}.Aci1na_refresh:hover{background:var(--shining-soft)}.Aci1na_list{flex-direction:column;gap:8px;margin:0;padding:0;list-style:none;display:flex}.Aci1na_session{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-module-platform);cursor:pointer;width:100%;color:var(--dsw-alias-label-primary);font:inherit;text-align:left;border-radius:8px;gap:8px;padding:8px;display:flex}.Aci1na_session:hover{border-color:var(--shining-border,var(--dsw-alias-border-l2));background:color-mix(in srgb, var(--dsw-alias-bg-module-platform) 80%, var(--shining-soft,transparent))}.Aci1na_peer{flex:none;font-weight:600}.Aci1na_preview{text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary);flex:1;overflow:hidden}.Aci1na_detail{border:1px solid var(--shining-border,var(--dsw-alias-border-l2));border-radius:8px;flex-direction:column;gap:8px;padding:12px;display:flex}.Aci1na_messages{flex-direction:column;gap:6px;max-height:40vh;margin:0;padding:0;list-style:none;display:flex;overflow-y:auto}.Aci1na_user{background:var(--shining-gradient,var(--shining-primary));color:#fff;border-radius:10px;align-self:flex-end;max-width:75%;padding:5px 10px}.Aci1na_assistant{background:var(--dsw-alias-bg-base);border-radius:10px;align-self:flex-start;max-width:75%;padding:5px 10px}.Aci1na_composer{gap:8px;display:flex}.Aci1na_input{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);border-radius:6px;flex:1;padding:6px 10px}.Aci1na_input:focus{border-color:var(--shining-primary);box-shadow:0 0 0 2px var(--shining-glow);outline:none}.Aci1na_send{background:var(--shining-gradient,var(--shining-primary));color:#fff;cursor:pointer;border:0;border-radius:6px;padding:6px 14px}.Aci1na_empty{color:var(--dsw-alias-label-secondary);font-size:13px}";
const tagId$4 = "dsh-shiningweb-ui/QqSessions.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$4) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-shiningweb-ui";
	tag.dataset.pluginCss = tagId$4;
	tag.textContent = css$4;
	document.head.appendChild(tag);
}
var QqSessions_module_css_default = {
	"assistant": "Aci1na_assistant",
	"composer": "Aci1na_composer",
	"detail": "Aci1na_detail",
	"empty": "Aci1na_empty",
	"input": "Aci1na_input",
	"list": "Aci1na_list",
	"messages": "Aci1na_messages",
	"peer": "Aci1na_peer",
	"preview": "Aci1na_preview",
	"refresh": "Aci1na_refresh",
	"send": "Aci1na_send",
	"session": "Aci1na_session",
	"user": "Aci1na_user",
	"wrap": "Aci1na_wrap"
};

//#endregion
//#region src/client/components/QqSessions.tsx
function QqSessions() {
	const [sessions, setSessions] = (0, react.useState)([]);
	const [open, setOpen] = (0, react.useState)(null);
	const [draft, setDraft] = (0, react.useState)("");
	const remote = useShiningRemote();
	const refresh = () => {
		remote?.qqList({}).then((r) => {
			if (r.ok) setSessions(r.value.sessions);
		});
	};
	(0, react.useEffect)(() => {
		refresh();
	}, [remote]);
	const openSession = (s) => {
		if (remote) remote.qqRead({ key: s.key }).then((r) => {
			if (r.ok && r.value.session) setOpen(r.value.session);
		});
	};
	const reply = async () => {
		if (!open || !draft.trim() || !remote) return;
		await remote.qqSend({
			key: open.key,
			content: draft.trim()
		});
		setDraft("");
		refresh();
		remote.qqRead({ key: open.key }).then((r) => {
			if (r.ok && r.value.session) setOpen(r.value.session);
		});
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: QqSessions_module_css_default.wrap,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				className: QqSessions_module_css_default.refresh,
				onClick: () => {
					refresh();
				},
				children: "刷新"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("ul", {
				className: QqSessions_module_css_default.list,
				children: [sessions.map((s) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					className: QqSessions_module_css_default.session,
					onClick: () => openSession(s),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: QqSessions_module_css_default.peer,
						children: s.kind === "group" ? `群 ${s.peerId}` : `私聊 ${s.peerId}`
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: QqSessions_module_css_default.preview,
						children: s.messages[s.messages.length - 1]?.content?.slice(0, 30) ?? ""
					})]
				}) }, s.key)), sessions.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", {
					className: QqSessions_module_css_default.empty,
					children: "暂无 QQ 会话（需配置 QQ 并接收消息）"
				}) : null]
			}),
			open ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: QqSessions_module_css_default.detail,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
					className: QqSessions_module_css_default.messages,
					children: open.messages.map((m, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", {
						className: m.role === "user" ? QqSessions_module_css_default.user : QqSessions_module_css_default.assistant,
						children: m.content
					}, i))
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: QqSessions_module_css_default.composer,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						className: QqSessions_module_css_default.input,
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						placeholder: "回复…",
						onKeyDown: (e) => {
							if (e.key === "Enter") reply();
						}
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						className: QqSessions_module_css_default.send,
						onClick: () => void reply(),
						disabled: !draft.trim(),
						children: "发送"
					})]
				})]
			}) : null
		]
	});
}

//#endregion
//#region src/client/memory.ts
/**
* 聚合记忆上下文（发起前调用）：读 dsh-mneme 相关记忆 + 天圆地方自持记忆。
* dsh-mneme 不可用时优雅降级为自持记忆。
* @param query - 用于 dsh-mneme 检索的关键词（通常为当前用户输入）。
*/
async function readMemoryContext(query) {
	const chunks = [];
	try {
		const res = await fetch(`/api/dsh-mneme/search?q=${encodeURIComponent(query)}&limit=5`);
		if (res.ok) {
			const data = await res.json();
			for (const it of data.items ?? []) {
				const content = it.content ?? "";
				if (content) chunks.push(`【记忆】${it.title ? `${it.title}：` : ""}${content}`);
			}
		}
	} catch {}
	for (const n of await listMemoryNotes(3)) chunks.push(`【天圆地方记忆】${n.content}`);
	return chunks.slice(0, 6).join("\n");
}

//#endregion
//#region \0dsh-css:F:\余程安学习资料\dsh-shiningweb-ui\src\client\components\ChatWindow.module.css.mjs
const css$3 = ".jtKunW_overlay{z-index:1000;pointer-events:auto;justify-content:center;align-items:center;display:flex;position:fixed;inset:0}.jtKunW_backdrop{background:#0006;position:absolute;inset:0}.jtKunW_panel{border:1px solid var(--shining-border,var(--dsw-alias-border-l2));width:min(720px,92vw);height:min(560px,86vh);box-shadow:0 12px 40px #00000040, 0 0 0 1px var(--shining-glow,transparent);background-color:var(--dsw-alias-bg-overlay);background-position:50%;background-size:cover;border-radius:16px;flex-direction:column;display:flex;position:relative;overflow:hidden}.jtKunW_header{border-bottom:1px solid var(--shining-border,var(--dsw-alias-border-l2));background:linear-gradient(to bottom, var(--shining-soft,transparent), transparent);justify-content:space-between;align-items:center;padding:14px 16px;display:flex}.jtKunW_title{margin:0;font-size:16px}.jtKunW_tag{color:var(--dsw-alias-label-secondary);margin-left:8px;font-size:12px}.jtKunW_upload{color:var(--dsw-alias-label-secondary);cursor:pointer;margin-left:auto;margin-right:8px;font-size:12px}.jtKunW_close{cursor:pointer;color:var(--dsw-alias-label-primary);background:0 0;border:0;margin-left:8px;font-size:18px}.jtKunW_messages{flex-direction:column;flex:1;gap:8px;margin:0;padding:16px;list-style:none;display:flex;overflow-y:auto}.jtKunW_user{background:var(--shining-gradient,var(--shining-primary));color:#fff;border-radius:12px;align-self:flex-end;max-width:70%;padding:6px 12px}.jtKunW_assistant{background:color-mix(in srgb, var(--dsw-alias-bg-module-platform) 80%, var(--shining-soft,transparent));border-radius:12px;align-self:flex-start;max-width:70%;padding:6px 12px}.jtKunW_footer{border-top:1px solid var(--shining-border,var(--dsw-alias-border-l2));background:linear-gradient(to top, var(--shining-soft,transparent), transparent);gap:8px;padding:12px 16px;display:flex}.jtKunW_input{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);border-radius:8px;flex:1;padding:8px 12px}.jtKunW_input:focus{border-color:var(--shining-primary);box-shadow:0 0 0 2px var(--shining-glow);outline:none}.jtKunW_send{background:var(--shining-gradient,var(--shining-primary));color:#fff;cursor:pointer;border:0;border-radius:8px;padding:8px 16px}.jtKunW_send:disabled{opacity:.5;cursor:default}.jtKunW_tabs{border-bottom:1px solid var(--dsw-alias-border-l2);background:color-mix(in srgb, var(--dsw-alias-bg-overlay) 80%, transparent);gap:8px;padding:8px 16px;display:flex}.jtKunW_tab{cursor:pointer;color:var(--dsw-alias-label-secondary);font:inherit;background:0 0;border:0;padding:6px 12px}.jtKunW_tabActive{background:var(--shining-soft,transparent);cursor:pointer;color:var(--shining-primary);font:inherit;border:0;border-bottom:2px solid var(--shining-primary);border-radius:6px 6px 0 0;padding:6px 12px;font-weight:600}.jtKunW_delegate{border:1px solid var(--shining-border,var(--dsw-alias-border-l2));cursor:pointer;color:var(--shining-primary);background:0 0;border-radius:8px;padding:8px 12px}.jtKunW_delegate:hover{background:var(--shining-soft)}.jtKunW_confirm{z-index:1001;background:#0006;justify-content:center;align-items:center;display:flex;position:absolute;inset:0}.jtKunW_confirmBox{background:var(--dsw-alias-bg-module-platform);border:1px solid var(--dsw-alias-border-l2);border-radius:12px;width:min(360px,80vw);padding:16px}.jtKunW_confirmActions{justify-content:flex-end;gap:8px;margin-top:12px;display:flex}.jtKunW_confirmActions button{border:1px solid var(--dsw-alias-border-l2);cursor:pointer;color:var(--dsw-alias-label-primary);background:0 0;border-radius:6px;padding:6px 12px}";
const tagId$3 = "dsh-shiningweb-ui/ChatWindow.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$3) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-shiningweb-ui";
	tag.dataset.pluginCss = tagId$3;
	tag.textContent = css$3;
	document.head.appendChild(tag);
}
var ChatWindow_module_css_default = {
	"assistant": "jtKunW_assistant",
	"backdrop": "jtKunW_backdrop",
	"close": "jtKunW_close",
	"confirm": "jtKunW_confirm",
	"confirmActions": "jtKunW_confirmActions",
	"confirmBox": "jtKunW_confirmBox",
	"delegate": "jtKunW_delegate",
	"footer": "jtKunW_footer",
	"header": "jtKunW_header",
	"input": "jtKunW_input",
	"messages": "jtKunW_messages",
	"overlay": "jtKunW_overlay",
	"panel": "jtKunW_panel",
	"send": "jtKunW_send",
	"tab": "jtKunW_tab",
	"tabActive": "jtKunW_tabActive",
	"tabs": "jtKunW_tabs",
	"tag": "jtKunW_tag",
	"title": "jtKunW_title",
	"upload": "jtKunW_upload",
	"user": "jtKunW_user"
};

//#endregion
//#region src/client/components/ChatWindow.tsx
const MODE_LABEL = {
	pet: "萌宠",
	assistant: "助理",
	super: "超级助理"
};
function ChatWindow(_props) {
	const { chatOpen } = useShiningStore();
	const settings = useSettings();
	const [tab, setTab] = (0, react.useState)("chat");
	const [input, setInput] = (0, react.useState)("");
	const [confirmSend, setConfirmSend] = (0, react.useState)(false);
	const dshContext = useDshContext();
	const { rec, busy, send } = useChat(settings.chat.personaId || "default", useShiningRemote(), settings);
	if (!chatOpen || !settings.enabled || !settings.chat.enabled) return null;
	const mode = settings.capabilityMode;
	const canDelegate = mode !== "pet" && getCurrentSessionId() !== void 0;
	const contextText = mode === "pet" ? void 0 : dshContextToText(dshContext);
	const onImage = async (file) => {
		if (!file) return;
		try {
			setImage(await compressImage(file));
		} catch {}
	};
	const backgroundImage = getImage();
	const doSend = async () => {
		const mem = await readMemoryContext(input);
		const combined = [contextText, mem].filter(Boolean).join("\n");
		await send(input, combined);
	};
	const doDelegate = () => {
		const cur = getCurrentSessionId();
		if (!cur || !input.trim()) return;
		if (mode === "assistant") {
			setConfirmSend(true);
			return;
		}
		sendToSession(cur, input.trim());
		setInput("");
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: ChatWindow_module_css_default.overlay,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": dict.zh.chatTitle,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: ChatWindow_module_css_default.backdrop,
				onClick: closeChat
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: ChatWindow_module_css_default.panel,
				style: {
					backdropFilter: `blur(var(--shining-blur))`,
					backgroundImage: backgroundImage ? `url(${backgroundImage})` : void 0
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: ChatWindow_module_css_default.header,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
								className: ChatWindow_module_css_default.title,
								children: dict.zh.chatTitle
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: ChatWindow_module_css_default.tag,
								children: [
									"人格：",
									settings.chat.personaId || "默认",
									" · ",
									MODE_LABEL[mode] ?? mode
								]
							})] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: ChatWindow_module_css_default.upload,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									hidden: true,
									onChange: (e) => void onImage(e.target.files?.[0])
								}), "更换立绘"]
							}),
							backgroundImage ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: ChatWindow_module_css_default.close,
								onClick: clearImage,
								"aria-label": "clear image",
								children: "清除立绘"
							}) : null,
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: ChatWindow_module_css_default.close,
								onClick: closeChat,
								"aria-label": dict.zh.close,
								children: "×"
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("nav", {
						className: ChatWindow_module_css_default.tabs,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: tab === "chat" ? ChatWindow_module_css_default.tabActive : ChatWindow_module_css_default.tab,
								onClick: () => setTab("chat"),
								children: "聊天"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: tab === "circle" ? ChatWindow_module_css_default.tabActive : ChatWindow_module_css_default.tab,
								onClick: () => setTab("circle"),
								children: "朋友圈"
							}),
							mode === "super" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: tab === "qq" ? ChatWindow_module_css_default.tabActive : ChatWindow_module_css_default.tab,
								onClick: () => setTab("qq"),
								children: "QQ 会话"
							}) : null
						]
					}),
					tab === "chat" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
						className: ChatWindow_module_css_default.messages,
						children: (rec?.messages ?? []).map((m, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", {
							className: m.role === "user" ? ChatWindow_module_css_default.user : ChatWindow_module_css_default.assistant,
							children: m.content
						}, i))
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("footer", {
						className: ChatWindow_module_css_default.footer,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								className: ChatWindow_module_css_default.input,
								value: input,
								onChange: (e) => setInput(e.target.value),
								placeholder: dict.zh.sendPlaceholder,
								onKeyDown: (e) => {
									if (e.key === "Enter") doSend();
								}
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: ChatWindow_module_css_default.send,
								onClick: doSend,
								disabled: busy,
								children: dict.zh.send
							}),
							canDelegate ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: ChatWindow_module_css_default.delegate,
								onClick: doDelegate,
								disabled: busy,
								children: "委派到 DSH"
							}) : null
						]
					})] }) : tab === "circle" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FriendCircle, { personaId: settings.chat.personaId || "default" }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(QqSessions, {})
				]
			}),
			confirmSend ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: ChatWindow_module_css_default.confirm,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: ChatWindow_module_css_default.confirmBox,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "将这条任务发送给当前 DSH 会话？" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: false,
							readOnly: true
						}), " 本次会话不再提示"] }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: ChatWindow_module_css_default.confirmActions,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								onClick: () => {
									setConfirmSend(false);
									sendToSession(getCurrentSessionId(), input.trim());
									setInput("");
								},
								children: "确认"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								onClick: () => setConfirmSend(false),
								children: "取消"
							})]
						})
					]
				})
			}) : null
		]
	});
}

//#endregion
//#region src/client/hooks/useFileTree.ts
function useFileTree(root$1, showHidden, remote) {
	const [children, setChildren] = (0, react.useState)({});
	const [expanded, setExpanded] = (0, react.useState)({});
	const toggle = (0, react.useCallback)(async (relPath) => {
		const next = !expanded[relPath];
		setExpanded((e) => ({
			...e,
			[relPath]: next
		}));
		if (next && !children[relPath] && remote) {
			const res = await remote.fsList({
				root: root$1,
				path: relPath || ".",
				showHidden
			});
			if (res.ok) setChildren((c) => ({
				...c,
				[relPath]: res.value.entries
			}));
		}
	}, [
		root$1,
		showHidden,
		expanded,
		children,
		remote
	]);
	const refresh = (0, react.useCallback)(async () => {
		setChildren({});
		setExpanded({});
	}, []);
	return {
		children,
		expanded,
		toggle,
		refresh
	};
}

//#endregion
//#region \0dsh-css:F:\余程安学习资料\dsh-shiningweb-ui\src\client\components\FileExplorer.module.css.mjs
const css$2 = "._4O1cOG_drawer{z-index:999;border-right:1px solid var(--shining-border,var(--dsw-alias-border-l2));background:color-mix(in srgb, var(--dsw-alias-bg-overlay) 92%, transparent);width:min(360px,70vw);backdrop-filter:blur(var(--shining-blur));pointer-events:auto;flex-direction:column;display:flex;position:fixed;top:0;bottom:0;left:0}._4O1cOG_header{border-bottom:1px solid var(--shining-border,var(--dsw-alias-border-l2));justify-content:space-between;align-items:center;padding:12px 16px;display:flex}._4O1cOG_title{font-size:14px;font-weight:600}._4O1cOG_close{cursor:pointer;color:var(--dsw-alias-label-primary);background:0 0;border:0;font-size:18px}._4O1cOG_search{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);border-radius:6px;margin:8px 12px;padding:6px 10px}._4O1cOG_search:focus{border-color:var(--shining-primary);box-shadow:0 0 0 2px var(--shining-glow);outline:none}._4O1cOG_tree{flex:1;margin:0;padding:0 8px;list-style:none;overflow-y:auto}._4O1cOG_children{margin:0;padding-left:16px;list-style:none}._4O1cOG_row{cursor:pointer;width:100%;color:var(--dsw-alias-label-primary);font:inherit;text-align:left;background:0 0;border:0;align-items:center;gap:6px;padding:4px 8px;display:flex}._4O1cOG_row:hover{background:var(--shining-soft,var(--dsw-alias-interactive-bg-hover))}._4O1cOG_icon{text-align:center;width:16px;color:var(--shining-accent);flex:none;font-size:11px}._4O1cOG_name{text-overflow:ellipsis;white-space:nowrap;flex:1;font-size:13px;overflow:hidden}._4O1cOG_menu{z-index:1001;background:var(--dsw-alias-bg-module-platform);border:1px solid var(--shining-border,var(--dsw-alias-border-l2));border-radius:6px;flex-direction:column;min-width:120px;padding:4px;display:flex;position:fixed}._4O1cOG_menu button{cursor:pointer;text-align:left;color:var(--dsw-alias-label-primary);font:inherit;background:0 0;border:0;padding:6px 12px}._4O1cOG_menu button:hover{background:var(--shining-soft,var(--dsw-alias-interactive-bg-hover))}";
const tagId$2 = "dsh-shiningweb-ui/FileExplorer.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-shiningweb-ui";
	tag.dataset.pluginCss = tagId$2;
	tag.textContent = css$2;
	document.head.appendChild(tag);
}
var FileExplorer_module_css_default = {
	"children": "_4O1cOG_children",
	"close": "_4O1cOG_close",
	"drawer": "_4O1cOG_drawer",
	"header": "_4O1cOG_header",
	"icon": "_4O1cOG_icon",
	"menu": "_4O1cOG_menu",
	"name": "_4O1cOG_name",
	"row": "_4O1cOG_row",
	"search": "_4O1cOG_search",
	"title": "_4O1cOG_title",
	"tree": "_4O1cOG_tree"
};

//#endregion
//#region src/client/components/FileExplorer.tsx
function extIcon(name) {
	const ext = name.split(".").pop()?.toLowerCase() ?? "";
	const map = {
		js: "JS",
		ts: "TS",
		py: "PY",
		json: "{}",
		md: "M",
		txt: "T",
		html: "<>"
	};
	return map[ext] ?? "•";
}
function FileExplorer(_props) {
	const { filesOpen } = useShiningStore();
	const settings = useSettings();
	const [query, setQuery] = (0, react.useState)("");
	const [menu, setMenu] = (0, react.useState)(null);
	const remote = getShiningRemote();
	const root$1 = getWorkspaceRoot();
	const openPath = getOpenPath();
	const tree = useFileTree(root$1, settings.fileExplorer.showHidden, remote);
	if (!filesOpen || !settings.enabled || !settings.fileExplorer.enabled) return null;
	const filtered = (entries) => (entries ?? []).filter((e) => !query || e.name.toLowerCase().includes(query.toLowerCase()));
	const renderDir = (rel) => {
		const children = filtered(tree.children[rel]);
		return children.map((e) => {
			const childRel = rel ? `${rel}/${e.name}` : e.name;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: FileExplorer_module_css_default.row,
				onContextMenu: (ev) => {
					ev.preventDefault();
					setMenu({
						x: ev.clientX,
						y: ev.clientY,
						path: childRel
					});
				},
				onClick: () => {
					if (e.isDirectory) tree.toggle(childRel);
					else openPath?.(childRel);
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: FileExplorer_module_css_default.icon,
					children: e.isDirectory ? "▸" : extIcon(e.name)
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: FileExplorer_module_css_default.name,
					children: e.name
				})]
			}), e.isDirectory && tree.expanded[childRel] ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
				className: FileExplorer_module_css_default.children,
				children: renderDir(childRel)
			}) : null] }, childRel);
		});
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: FileExplorer_module_css_default.drawer,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
				className: FileExplorer_module_css_default.header,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: FileExplorer_module_css_default.title,
					children: dict.zh.entryFiles
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					className: FileExplorer_module_css_default.close,
					onClick: closeFiles,
					"aria-label": dict.zh.close,
					children: "×"
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
				className: FileExplorer_module_css_default.search,
				value: query,
				onChange: (e) => setQuery(e.target.value),
				placeholder: dict.zh.fileFilter
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
				className: FileExplorer_module_css_default.tree,
				children: renderDir("")
			}),
			menu ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CtxMenu, {
				menu,
				onClose: () => setMenu(null),
				remote,
				root: root$1,
				onDone: () => void tree.refresh()
			}) : null
		]
	});
}
function CtxMenu(props) {
	const run = async (op) => {
		await op();
		props.onClose();
		props.onDone();
	};
	const copy = () => {
		navigator.clipboard.writeText(props.menu.path);
		props.onClose();
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: FileExplorer_module_css_default.menu,
		style: {
			left: props.menu.x,
			top: props.menu.y
		},
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				onClick: () => void run(() => props.remote.fsCreateFile({
					root: props.root,
					path: props.menu.path
				})),
				children: dict.zh.newFile
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				onClick: () => void run(() => props.remote.fsCreateDir({
					root: props.root,
					path: props.menu.path
				})),
				children: dict.zh.newDir
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				onClick: () => void run(() => props.remote.fsRename({
					root: props.root,
					path: props.menu.path,
					newName: "renamed"
				})),
				children: dict.zh.rename
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				onClick: () => void run(() => props.remote.fsDelete({
					root: props.root,
					path: props.menu.path
				})),
				children: dict.zh.remove
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				onClick: copy,
				children: dict.zh.copyPath
			})
		]
	});
}

//#endregion
//#region src/client/hooks/useGitBranch.ts
function useGitBranch(root$1, remote) {
	const [state$1, setState] = (0, react.useState)({
		branch: "",
		dirtyCount: 0,
		changes: []
	});
	const refresh = (0, react.useCallback)(async () => {
		if (!remote) return;
		const res = await remote.gitStatus({
			root: root$1,
			repoPath: "."
		});
		if (res.ok) setState(res.value);
	}, [root$1, remote]);
	return {
		state: state$1,
		refresh
	};
}

//#endregion
//#region \0dsh-css:F:\余程安学习资料\dsh-shiningweb-ui\src\client\components\GitManager.module.css.mjs
const css$1 = ".-\\33 ZkfG_bar{box-sizing:border-box;width:calc(100% - var(--dsh-composer-side-clearance) - var(--dsh-composer-side-clearance) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset));max-width:calc(var(--dsh-composer-card-max-width) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset));padding:0 var(--dsh-composer-dock-inset);color:var(--dsw-alias-label-secondary);flex:none;align-items:center;gap:6px;margin:0 auto;font-size:12px;display:flex}.-\\33 ZkfG_select{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);border-radius:5px;padding:3px 6px}.-\\33 ZkfG_select:focus{border-color:var(--shining-primary);box-shadow:0 0 0 2px var(--shining-glow);outline:none}.-\\33 ZkfG_new{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);width:90px;color:var(--dsw-alias-label-primary);border-radius:5px;padding:3px 6px}.-\\33 ZkfG_new:focus{border-color:var(--shining-primary);box-shadow:0 0 0 2px var(--shining-glow);outline:none}.-\\33 ZkfG_btn{border:1px solid var(--shining-border,var(--dsw-alias-border-l2));cursor:pointer;color:var(--shining-primary);background:0 0;border-radius:5px;padding:3px 8px}.-\\33 ZkfG_btn:hover{background:var(--shining-soft)}.-\\33 ZkfG_dirty{margin-left:auto}.-\\33 ZkfG_err{color:var(--dsw-alias-state-error-primary,#f56c6c);font-size:11px}";
const tagId$1 = "dsh-shiningweb-ui/GitManager.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-shiningweb-ui";
	tag.dataset.pluginCss = tagId$1;
	tag.textContent = css$1;
	document.head.appendChild(tag);
}
var GitManager_module_css_default = {
	"bar": "-3ZkfG_bar",
	"btn": "-3ZkfG_btn",
	"dirty": "-3ZkfG_dirty",
	"err": "-3ZkfG_err",
	"new": "-3ZkfG_new",
	"select": "-3ZkfG_select"
};

//#endregion
//#region src/client/components/GitManager.tsx
const REFRESH_MS = {
	"10s": 1e4,
	"30s": 3e4,
	"1m": 6e4
};
function GitManager(_props) {
	const settings = useSettings();
	const remote = useShiningRemote();
	const root$1 = useWorkspaceRoot();
	const git = useGitBranch(root$1, remote);
	const [branches, setBranches] = (0, react.useState)([]);
	const [newBranch, setNewBranch] = (0, react.useState)("");
	const [busy, setBusy] = (0, react.useState)(false);
	const [gitErr, setGitErr] = (0, react.useState)("");
	(0, react.useEffect)(() => {
		if (!settings.enabled || !settings.git.enabled) return;
		if (!root$1 || !remote) {
			setGitErr(remote ? "未获取到工作区" : "远程服务未就绪");
			return;
		}
		let alive = true;
		const refresh = async () => {
			try {
				const res = await remote.gitStatus({
					root: root$1,
					repoPath: "."
				});
				if (!alive) return;
				if (res.ok) {
					git.refresh();
					setBranches([res.value.branch]);
					setGitErr("");
				} else setGitErr(res.error.message);
			} catch (e) {
				const error = e instanceof Error ? e.message : String(e);
				if (alive) setGitErr(`remote调用失败: ${error}`);
			}
		};
		refresh();
		const interval = REFRESH_MS[settings.git.autoRefresh];
		if (interval) {
			const t = setInterval(() => void refresh(), interval);
			return () => {
				alive = false;
				clearInterval(t);
			};
		}
		return () => {
			alive = false;
		};
	}, [
		settings.enabled,
		settings.git.enabled,
		settings.git.autoRefresh,
		root$1,
		remote
	]);
	if (!settings.enabled || !settings.git.enabled) return null;
	const doCheckout = async (branch) => {
		if (!remote || branch === git.state.branch) return;
		setBusy(true);
		await remote.gitCheckout({
			root: root$1,
			repoPath: ".",
			branch
		});
		setBusy(false);
		await git.refresh();
	};
	const doCreate = async () => {
		if (!remote || !newBranch.trim()) return;
		setBusy(true);
		await remote.gitCreateBranch({
			root: root$1,
			repoPath: ".",
			name: newBranch.trim()
		});
		setNewBranch("");
		setBusy(false);
		await git.refresh();
	};
	const doPull = async () => {
		if (!remote) return;
		setBusy(true);
		await remote.gitPull({
			root: root$1,
			repoPath: "."
		});
		setBusy(false);
		await git.refresh();
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: GitManager_module_css_default.bar,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
				className: GitManager_module_css_default.select,
				value: git.state.branch,
				onChange: (e) => void doCheckout(e.target.value),
				disabled: busy,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
					value: git.state.branch,
					children: git.state.branch || "无分支"
				}), branches.map((b) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
					value: b,
					children: b
				}, b))]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
				className: GitManager_module_css_default.new,
				value: newBranch,
				onChange: (e) => setNewBranch(e.target.value),
				placeholder: "新分支名"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				className: GitManager_module_css_default.btn,
				onClick: () => void doCreate(),
				disabled: busy,
				children: "+"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				className: GitManager_module_css_default.btn,
				onClick: () => void doPull(),
				disabled: busy,
				children: "pull"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: GitManager_module_css_default.dirty,
				children: [
					dict.zh.dirtyCount,
					" ",
					git.state.dirtyCount
				]
			}),
			gitErr ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: GitManager_module_css_default.err,
				title: gitErr,
				children: gitErr
			}) : null
		]
	});
}

//#endregion
//#region \0dsh-css:F:\余程安学习资料\dsh-shiningweb-ui\src\client\components\SettingsPanel.module.css.mjs
const css = ".OkWOBG_group{flex-direction:column;gap:16px;padding:16px 0;display:flex}.OkWOBG_title{margin:0 0 4px;font-size:18px}.OkWOBG_section{border-bottom:1px solid var(--shining-border,var(--dsw-alias-border-l2));flex-direction:column;gap:6px;padding:8px 0;display:flex}.OkWOBG_sub{margin:0 0 4px;font-size:14px}.OkWOBG_row{color:var(--dsw-alias-label-primary);align-items:center;gap:8px;margin:4px 0;display:flex}.OkWOBG_row input[type=checkbox],.OkWOBG_row input[type=range]{accent-color:var(--shining-primary)}.OkWOBG_label{min-width:90px}.OkWOBG_link{cursor:pointer;color:var(--shining-accent,var(--dsw-alias-state-warn-primary));font:inherit;background:0 0;border:0;align-self:flex-start}.OkWOBG_longTextarea{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);min-height:72px;color:var(--dsw-alias-label-primary);resize:vertical;border-radius:6px;flex:1;padding:6px 8px}";
const tagId = "dsh-shiningweb-ui/SettingsPanel.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-shiningweb-ui";
	tag.dataset.pluginCss = tagId;
	tag.textContent = css;
	document.head.appendChild(tag);
}
var SettingsPanel_module_css_default = {
	"group": "OkWOBG_group",
	"label": "OkWOBG_label",
	"link": "OkWOBG_link",
	"longTextarea": "OkWOBG_longTextarea",
	"row": "OkWOBG_row",
	"section": "OkWOBG_section",
	"sub": "OkWOBG_sub",
	"title": "OkWOBG_title"
};

//#endregion
//#region src/client/components/SettingsPanel.tsx
function SettingsPanel(_props) {
	const settings = useSettings();
	const patch = async (key, value) => {
		await writeSetting(String(key), value);
	};
	const onImage = async (file) => {
		if (!file) return;
		try {
			setImage(await compressImage(file));
		} catch {}
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: SettingsPanel_module_css_default.group,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
				className: SettingsPanel_module_css_default.title,
				children: dict.zh.settingsTitle
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Toggle, {
				label: "启用璀璨星河",
				checked: settings.enabled,
				onChange: (v) => void patch("enabled", v)
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: SettingsPanel_module_css_default.section,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", {
					className: SettingsPanel_module_css_default.sub,
					children: "能力模式"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
					className: SettingsPanel_module_css_default.row,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "模式" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
						value: settings.capabilityMode,
						onChange: (e) => void patch("capabilityMode", e.target.value),
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "pet",
								children: "萌宠（仅聊天+记忆+立绘）"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "assistant",
								children: "助理（可读主对话+代发需确认）"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "super",
								children: "超级助理（可调 Agent+QQ 接入）"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: SettingsPanel_module_css_default.section,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Toggle, {
						label: "天圆地方",
						checked: settings.chat.enabled,
						onChange: (v) => void patch("chat", {
							...settings.chat,
							enabled: v
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Row, {
						label: "模型",
						value: settings.chat.model,
						onChange: (v) => void patch("chat", {
							...settings.chat,
							model: v
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Row, {
						label: "API Base",
						value: settings.chat.apiBase,
						onChange: (v) => void patch("chat", {
							...settings.chat,
							apiBase: v
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Row, {
						label: "API Key",
						value: settings.chat.apiKey,
						type: "password",
						onChange: (v) => void patch("chat", {
							...settings.chat,
							apiKey: v
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: SettingsPanel_module_css_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*",
							onChange: (e) => void onImage(e.target.files?.[0])
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "更换立绘" })]
					}),
					getImage() ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						className: SettingsPanel_module_css_default.link,
						onClick: clearImage,
						children: "清除立绘"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: SettingsPanel_module_css_default.section,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Toggle, {
					label: "文件栏",
					checked: settings.fileExplorer.enabled,
					onChange: (v) => void patch("fileExplorer", {
						...settings.fileExplorer,
						enabled: v
					})
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Toggle, {
					label: "显示隐藏文件",
					checked: settings.fileExplorer.showHidden,
					onChange: (v) => void patch("fileExplorer", {
						...settings.fileExplorer,
						showHidden: v
					})
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: SettingsPanel_module_css_default.section,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Toggle, {
					label: "Git 分支管理",
					checked: settings.git.enabled,
					onChange: (v) => void patch("git", {
						...settings.git,
						enabled: v
					})
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
					className: SettingsPanel_module_css_default.row,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "自动刷新" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
						value: settings.git.autoRefresh,
						onChange: (e) => void patch("git", {
							...settings.git,
							autoRefresh: e.target.value
						}),
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "off",
								children: "关闭"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "10s",
								children: "10s"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "30s",
								children: "30s"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "1m",
								children: "1m"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: SettingsPanel_module_css_default.section,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", {
						className: SettingsPanel_module_css_default.sub,
						children: "视觉主题"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: SettingsPanel_module_css_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "主色调" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
							value: settings.visual.themeColor,
							onChange: (e) => void patch("visual", {
								...settings.visual,
								themeColor: e.target.value
							}),
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "galaxy-blue",
									children: "星河蓝"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "dawn-gold",
									children: "晨曦金"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "aurora-purple",
									children: "极光紫"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: SettingsPanel_module_css_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "毛玻璃强度" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: 24,
							value: settings.visual.glassBlur,
							onChange: (e) => void patch("visual", {
								...settings.visual,
								glassBlur: Number(e.target.value)
							})
						})]
					})
				]
			}),
			settings.capabilityMode === "super" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: SettingsPanel_module_css_default.section,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", {
						className: SettingsPanel_module_css_default.sub,
						children: "QQ 群接入"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Toggle, {
						label: "启用 QQ Bot",
						checked: settings.qq.enabled,
						onChange: (v) => void patch("qq", {
							...settings.qq,
							enabled: v
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Row, {
						label: "AppID",
						value: settings.qq.appId,
						onChange: (v) => void patch("qq", {
							...settings.qq,
							appId: v
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Row, {
						label: "AppSecret",
						value: settings.qq.appSecret,
						type: "password",
						onChange: (v) => void patch("qq", {
							...settings.qq,
							appSecret: v
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: SettingsPanel_module_css_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: SettingsPanel_module_css_default.label,
							children: "群号白名单"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							value: settings.qq.groupAllow.join(", "),
							onChange: (e) => void patch("qq", {
								...settings.qq,
								groupAllow: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
							})
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: SettingsPanel_module_css_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: SettingsPanel_module_css_default.label,
							children: "QQ 人格提示词"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
							className: SettingsPanel_module_css_default.longTextarea,
							value: settings.qq.personaPrompt,
							onChange: (e) => void patch("qq", {
								...settings.qq,
								personaPrompt: e.target.value
							})
						})]
					})
				]
			}) : null
		]
	});
}
function Toggle(props) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
		className: SettingsPanel_module_css_default.row,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
			type: "checkbox",
			checked: props.checked,
			onChange: (e) => props.onChange(e.target.checked)
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: props.label })]
	});
}
function Row(props) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
		className: SettingsPanel_module_css_default.row,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: SettingsPanel_module_css_default.label,
			children: props.label
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
			type: props.type ?? "text",
			value: props.value,
			onChange: (e) => props.onChange(e.target.value)
		})]
	});
}

//#endregion
//#region src/client/index.ts
/** Required services。不注入 'remote.shining'（我们自己在 apply 里挂载，声明为依赖会死锁）。 */
const inject = [
	"slots",
	"remote",
	"locale",
	"settingsScope",
	"connection",
	"workspaces",
	"sessions"
];
/** Client plugin body。 */
async function apply(ctx$1) {
	ctx$1.effect(() => ctx$1.locale.register(NS, dict), "shining: dictionaries");
	await ctx$1.remote.$mount(remote_default);
	const rem = ctx$1.get("remote.shining");
	setShiningRemote(rem);
	if (!rem) console.warn("[shining] remote.shining 未绑定——Git/聊天/文件/QQ 将不可用，请检查 host ShiningService 是否注册。");
	bindDshCtx(ctx$1);
	const scope$1 = ctx$1.settingsScope.bind({
		namespace: SETTINGS_NAMESPACE,
		decode: (section) => mergeSettings(section)
	});
	bindSettingsScope(scope$1);
	ctx$1.effect(() => scope$1.subscribe(() => applyVisual(scope$1.getSnapshot().value)), "shining: visual subscription");
	applyVisual(scope$1.getSnapshot().value);
	const syncRoot = () => {
		const snapshot$1 = ctx$1.workspaces.list.getSnapshot();
		setWorkspaceRoot(resolveCurrentWorkspaceRoot(snapshot$1));
	};
	syncRoot();
	ctx$1.effect(() => ctx$1.workspaces.list.subscribe(syncRoot), "shining: workspace root");
	setOpenPath((path) => void ctx$1.workspaces.openPath(path));
	ctx$1.slots.inject("sidebar.footer.action", () => ctx$1.slots.register({
		name: "sidebar.footer.action",
		id: "shining-chat",
		order: 30,
		locale: NS
	}, ChatEntry));
	ctx$1.slots.inject("sidebar.footer.action", () => ctx$1.slots.register({
		name: "sidebar.footer.action",
		id: "shining-files",
		order: 31,
		locale: NS
	}, FilesEntry));
	ctx$1.slots.inject("shell.overlay", () => ctx$1.slots.register({
		name: "shell.overlay",
		id: "shining-chat"
	}, ChatWindow));
	ctx$1.slots.inject("shell.overlay", () => ctx$1.slots.register({
		name: "shell.overlay",
		id: "shining-files"
	}, FileExplorer));
	ctx$1.slots.inject("conversation.input.dock", () => ctx$1.slots.register({
		name: "conversation.input.dock",
		id: "shining-git",
		order: 10
	}, GitManager));
	ctx$1.slots.inject("settings.section", () => ctx$1.slots.register({
		name: "settings.section",
		id: "shining",
		order: 20,
		label: () => dict.zh.settingsTitle,
		locale: NS
	}, SettingsPanel));
}

//#endregion
exports.apply = apply
exports.inject = inject
return module.exports; } });
//# sourceMappingURL=client.js.map