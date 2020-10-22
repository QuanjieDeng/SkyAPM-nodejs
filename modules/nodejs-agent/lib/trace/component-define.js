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

/**
 * @param {id} id
 * @param {name} name
 * @constructor
 * @author zhang xin
 */
function OfficeComponent(id, name) {
    this._id = id;
    this._name = name;
}

OfficeComponent.prototype.getId = function() {
    return this._id;
};

OfficeComponent.prototype.getName = function() {
    return this._name;
};

let Components = function() {
    this.HTTP = new OfficeComponent(2, "HTTP");
    this.MYSQL = new OfficeComponent(5, "MYSQL");
    this.EGG = new OfficeComponent(4003, "Egg");
    this.AMQP = new OfficeComponent(4004, "AMQP");
    this.SOCKETIO = new OfficeComponent(4005, "SOCKET.IO");
};

Components.instance = null;

Components.getInstance = function() {
    if (this.instance === null) {
        this.instance = new Components();
    }
    return this.instance;
};

exports.Components = Components.getInstance();
exports.OfficeComponent = OfficeComponent;
