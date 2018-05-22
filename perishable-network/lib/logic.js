/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.incas.bp.v2.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
function setupDemo(setupDemo) {

    var factory = getFactory();
    var NS = 'org.incas.bp.v2';

    // create the uploader
    var uploader = factory.newResource(NS, 'User', 'sanshi');
    uploader.accountBalance = 0;
    uploader.resources=[];
    return getParticipantRegistry(NS + '.User')
        .then(function (businessRegistry) {
            // add the growers
            return businessRegistry.addAll([uploader]);
        })    
}

/**
 * @param {org.incas.bp.v2.Recharge} recharge
 * @transaction 
 */
function Recharge(recharge){
    var NS = 'org.incas.bp.v2';
    var businessUser = recharge.businessUser;
    var value = recharge.value;
    if(value>0){
        businessUser.accountBalance+=value;
    }else{
        throw Error("value must be positive");
    }

    return getParticipantRegistry(NS + '.User')
    .then(function (userRegistry) {
        // add the temp reading to the shipment
        return userRegistry.update(recharge.businessUser);
    });
}
/**
 * @param {org.incas.bp.v2.Consume} consume
 * @transaction 
 */
function Consume(consume){
    var NS = 'org.incas.bp.v2';
    var businessUser = consume.businessUser;
    var value = consume.value;
    var resource = consume.resource;
    if(value>0){
        if(businessUser.accountBalance>=value){
            businessUser.accountBalance-=value;
            businessUser.resources.push(resource.resourceId)
        }else{
            throw Error("do not have enough  balance");
        }    
    }else{
        throw Error("value must be positive");
    }

    return getParticipantRegistry(NS + '.User')
    .then(function (userRegistry) {
        // add the temp reading to the shipment
        return userRegistry.update(consume.businessUser);
    });
}

