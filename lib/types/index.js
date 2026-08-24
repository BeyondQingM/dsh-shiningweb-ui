import { ShiningService } from "./gateway.js";
export { ShiningService } from "./gateway.js";
export default ShiningService;
/** Compatibility entry for hosts that load the module as a Cordis plugin. */
export function apply(ctx) {
    new ShiningService(ctx, {});
}
