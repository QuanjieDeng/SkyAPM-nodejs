/*
 * Licensed to the SkyAPM under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";

const ContextCarrier = require("skyapm-nodejs/lib/trace/context-carrier");
const layerDefine = require("skyapm-nodejs/lib/trace/span-layer");
const componentDefine = require("skyapm-nodejs/lib/trace/component-define");

/**
 *
 * @param {mongojsModule} mongojsModule
 * @param {instrumentation} instrumentation
 * @param {contextManager} contextManager
 * @return {*}
 * @author Quanjie.Deng
 */
module.exports = function(mongojsModule, instrumentation, contextManager) {
    instrumentation.enhanceMethod(mongojsModule, "runCommand", wrapRunCommand);
    return mongojsModule;
    /**
     * filterParams
     * @param {original} original
     * @return {*}
     */
    function wrapRunCommand(original) {
        return function(opts, cb) {
            let hasCallback = false;
            let enhanceCallback = cb;
            let contextCarrier = new ContextCarrier();
            let span = contextManager.createExitSpan("mongo/RunCommand", "mongodb", contextCarrier);
            span.component(componentDefine.Components.MONGOJS);
            span.spanLayer(layerDefine.Layers.DB);
            if (typeof cb === "function") {
                enhanceCallback = instrumentation.enhanceCallback(span.traceContext(),
                contextManager, function() {
                    contextManager.finishSpan(span);
                    return cb.apply(this, arguments);
                });
                hasCallback = true;
            }

            let result = original.apply(this, [opts, enhanceCallback]);
            if (result && !hasCallback) {
                contextManager.finishSpan(span);
            }
            return result;
        };
    }
};

