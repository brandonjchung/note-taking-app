import {
  CacheProvider,
  Select,
  components,
  createCache,
  createFilter,
  defaultTheme,
  mergeStyles,
  useStateManager
} from "./chunk-EHW7YOUV.js";
import {
  _extends
} from "./chunk-YEDHBTP7.js";
import "./chunk-Q6DFBYTI.js";
import {
  require_react_dom
} from "./chunk-JMVEG3FK.js";
import {
  require_react
} from "./chunk-TWJRYSII.js";
import {
  __toESM
} from "./chunk-DC5AMYBS.js";

// node_modules/react-select/dist/react-select.esm.js
var React = __toESM(require_react());
var import_react = __toESM(require_react());
var import_react_dom = __toESM(require_react_dom());
var StateManagedSelect = (0, import_react.forwardRef)(function(props, ref) {
  var baseSelectProps = useStateManager(props);
  return React.createElement(Select, _extends({
    ref
  }, baseSelectProps));
});
var StateManagedSelect$1 = StateManagedSelect;
var NonceProvider = function(_ref) {
  var nonce = _ref.nonce, children = _ref.children, cacheKey = _ref.cacheKey;
  var emotionCache = (0, import_react.useMemo)(function() {
    return createCache({
      key: cacheKey,
      nonce
    });
  }, [cacheKey, nonce]);
  return React.createElement(CacheProvider, {
    value: emotionCache
  }, children);
};
export {
  NonceProvider,
  components,
  createFilter,
  StateManagedSelect$1 as default,
  defaultTheme,
  mergeStyles,
  useStateManager
};
//# sourceMappingURL=react-select.js.map
