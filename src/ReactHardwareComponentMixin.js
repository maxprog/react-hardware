'use strict';

import ReactHardwareTagHandles from './ReactHardwareTagHandles';
import ReactInstanceMap from 'react/lib/ReactInstanceMap';

/**
 * ReactHarware vs ReactNative vs ReactWeb
 * -----------------------
 * TODO: React treats some pieces of data opaquely. This means that the information
 * is first class (it can be passed around), but cannot be inspected. This
 * allows us to build infrastructure that reasons about resources, without
 * making assumptions about the nature of those resources, and this allows that
 * infra to be shared across multiple platforms, where the resources are very
 * different. General infra (such as `ReactMultiChild`) reasons opaquely about
 * the data, but platform specific code (such as `ReactIOSNativeComponent`) can
 * make assumptions about the data.
 *
 *
 * `rootNodeID`, uniquely identifies a position in the generated native view
 * tree. Many layers of composite components (created with `React.createClass`)
 * can all share the same `rootNodeID`.
 *
 * `nodeHandle`: A sufficiently unambiguous way to refer to a lower level
 * resource (dom node, native view etc). The `rootNodeID` is sufficient for web
 * `nodeHandle`s, because the position in a tree is always enough to uniquely
 * identify a DOM node (we never have nodes in some bank outside of the
 * document). The same would be true for `ReactNative`, but we must maintain a
 * mapping  that we can send efficiently serializable
 * strings across native boundaries.
 *
 * Opaque name      TodaysWebReact   FutureWebWorkerReact   ReactNative
 * ----------------------------------------------------------------------------
 * nodeHandle       N/A              rootNodeID             tag
 *
 *
 * `mountImage`: A way to represent the potential to create lower level
 * resources whos `nodeHandle` can be discovered immediately by knowing the
 * `rootNodeID`. Today's web React represents this with `innerHTML` annotated
 * with DOM ids that match the `rootNodeID`.
 *
 * Opaque name      TodaysWebReact   FutureWebWorkerReact   ReactNative
 * ----------------------------------------------------------------------------
 * mountImage       innerHTML        innerHTML              {rootNodeID, tag}
 *
 */
var ReactHardwareComponentMixin = {
  /**
   * This has no particular meaning in ReactHardware. If this were in the DOM, this
   * would return the DOM node. There should be nothing that invokes this
   * method. Any current callers of this are mistaken - they should be invoking
   * `getNodeHandle`.
   */
  getNativeNode() {
    // TODO (balpert): Wrap iOS native components in a composite wrapper, then
    // ReactInstanceMap.get here will always succeed
    return ReactHardwareTagHandles.rootNodeIDToTag[
      (ReactInstanceMap.get(this) || this)._rootNodeID
    ];
  },

  getNodeHandle: function() {
    return ReactHardwareTagHandles.rootNodeIDToTag[
      (ReactInstanceMap.get(this) || this)._rootNodeID
    ];
  },
};

export default ReactHardwareComponentMixin;

