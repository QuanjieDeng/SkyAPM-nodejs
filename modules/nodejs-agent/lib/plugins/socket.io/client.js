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
 * @param {socketioModule} socketioModule
 * @param {instrumentation} instrumentation
 * @param {contextManager} contextManager
 * @return {*}
 * @author Quanjie.Deng
 */
module.exports = function(socketioModule, instrumentation, contextManager) {
    instrumentation.enhanceMethod(socketioModule, "ondecoded", wrapOndecoded);
    return socketioModule;
    /**
     * filterParams
     * @param {original} original
     * @return {*}
     */
    function wrapOndecoded(original) {
        return function(packet) {
            let contextCarrier = new ContextCarrier();
            if (packet.data.hasOwnProperty("headers")) {
                contextCarrier.fetchBy(function(key) {
                    if (packet.data.headers.hasOwnProperty(key)) {
                        return packet.data.headers[key];
                    }
                    return undefined;
                });
            }
            let opName = packet.nsp+packet.data[0];
            let span = contextManager.createEntrySpan(opName, contextCarrier);
            span.component(componentDefine.Components.SOCKETIO);
            span.spanLayer(layerDefine.Layers.HTTP);
            let result = original.apply(this, arguments);
            contextManager.finishSpan(span);
            return result;
        };
    }
};

