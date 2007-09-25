escapeJSONChar=function(){var A=["\b","\t","\n","\f","\r"];return function(C){if(C=="\""||C=="\\"){return"\\"+C}if(C.charCodeAt(0)>=32){return C}for(var B=0;B<A.length;B++){if(C==A[B]){return"\\"+C}}return C}}();function escapeJSONString(B){var C=B.split("");for(var A=0;A<C.length;A++){C[A]=escapeJSONChar(C[A])}return"\""+C.join("")+"\""}function toJSON(D){var B=[];if(D===null||D===undefined){return"null"}else{if(D.constructor==String){return escapeJSONString(D)}else{if(D.constructor==Number){return D.toString()}else{if(D.constructor==Boolean){return D.toString()}else{if(D.constructor==Date){return"{javaClass: \"java.util.Date\", time: "+D.valueOf()+"}"}else{if(D.constructor==Array){for(var C=0;C<D.length;C++){B.push(toJSON(D[C]))}return"["+B.join(", ")+"]"}else{for(var A in D){if(D[A]===null||D[A]===undefined){B.push("\""+A+"\": null")}else{if(typeof D[A]=="function"){}else{B.push(escapeJSONString(A)+": "+toJSON(D[A]))}}}return"{"+B.join(", ")+"}"}}}}}}}function JSONRpcClient(){var B=0,E;if(typeof arguments[0]=="function"){this.readyCB=arguments[0];B++}this.serverURL=arguments[B+0];this.user=arguments[B+1];this.pass=arguments[B+2];this.objectID=arguments[B+3];this.javaClass=arguments[B+4];this.JSONRPCType=arguments[B+5];if(JSONRpcClient.knownClasses[this.javaClass]&&(this.JSONRPCType=="CallableReference")){for(var D in JSONRpcClient.knownClasses[this.javaClass]){var F=JSONRpcClient.knownClasses[this.javaClass][D];this[D]=JSONRpcClient.bind(F,this)}}else{if(this.objectID){this._addMethods(["listMethods"],this.javaClass);E=this._makeRequest("listMethods",[])}else{this._addMethods(["system.listMethods"],this.javaClass);E=this._makeRequest("system.listMethods",[])}var A=this._sendRequest(E);this._addMethods(A,this.javaClass)}if(this.readyCB){var C=this;E.cb=function(G,H){if(!H){C._addMethods(G)}C.readyCB(G,H)}}}JSONRpcClient.knownClasses={};JSONRpcClient.Exception=function(E,D,C){this.code=E;var B,A;if(C){this.javaStack=C;A=C.match(/^([^:]*)/);if(A){B=A[0]}}if(B){this.name=B}else{this.name="JSONRpcClientException"}this.message=D};JSONRpcClient.Exception.CODE_REMOTE_EXCEPTION=490;JSONRpcClient.Exception.CODE_ERR_CLIENT=550;JSONRpcClient.Exception.CODE_ERR_PARSE=590;JSONRpcClient.Exception.CODE_ERR_NOMETHOD=591;JSONRpcClient.Exception.CODE_ERR_UNMARSHALL=592;JSONRpcClient.Exception.CODE_ERR_MARSHALL=593;JSONRpcClient.Exception.prototype=new Error();JSONRpcClient.Exception.prototype.toString=function(A,B){return this.name+": "+this.message};JSONRpcClient.default_ex_handler=function(A){alert(A)};JSONRpcClient.toplevel_ex_handler=JSONRpcClient.default_ex_handler;JSONRpcClient.profile_async=false;JSONRpcClient.max_req_active=1;JSONRpcClient.requestId=1;JSONRpcClient.bind=function(B,A){return function(){return B.apply(A,arguments)}};JSONRpcClient.prototype._createMethod=function(B){var A=function(){var C=[],F;for(var D=0;D<arguments.length;D++){C.push(arguments[D])}if(typeof C[0]=="function"){F=C.shift()}var E=this._makeRequest.call(this,B,C,F);if(!F){return this._sendRequest.call(this,E)}else{JSONRpcClient.async_requests.push(E);JSONRpcClient.kick_async();return E.requestId}};return A};JSONRpcClient.prototype._addMethods=function(C,H){if(H){JSONRpcClient.knownClasses[H]={}}var A;for(var B=0;B<C.length;B++){var E=this;var D=C[B].split(".");for(var G=0;G<D.length-1;G++){A=D[G];if(E[A]){E=E[A]}else{E[A]={};E=E[A]}}A=D[D.length-1];if(!E[A]){var F=this._createMethod(C[B]);E[A]=JSONRpcClient.bind(F,this);if(H&&(A!="listMethods")){JSONRpcClient.knownClasses[H][A]=F}}}};JSONRpcClient._getCharsetFromHeaders=function(A){try{var E=A.getResponseHeader("Content-type");var D=E.split(/\s*;\s*/);for(var B=0;B<D.length;B++){if(D[B].substring(0,8)=="charset="){return D[B].substring(8,D[B].length)}}}catch(C){}return"UTF-8"};JSONRpcClient.async_requests=[];JSONRpcClient.async_inflight={};JSONRpcClient.async_responses=[];JSONRpcClient.async_timeout=null;JSONRpcClient.num_req_active=0;JSONRpcClient._async_handler=function(){JSONRpcClient.async_timeout=null;while(JSONRpcClient.async_responses.length>0){var A=JSONRpcClient.async_responses.shift();if(A.canceled){continue}if(A.profile){A.profile.dispatch=new Date()}try{A.cb(A.result,A.ex,A.profile)}catch(C){JSONRpcClient.toplevel_ex_handler(C)}}while(JSONRpcClient.async_requests.length>0&&JSONRpcClient.num_req_active<JSONRpcClient.max_req_active){var B=JSONRpcClient.async_requests.shift();if(B.canceled){continue}B.client._sendRequest.call(B.client,B)}};JSONRpcClient.kick_async=function(){if(!JSONRpcClient.async_timeout){JSONRpcClient.async_timeout=setTimeout(JSONRpcClient._async_handler,0)}};JSONRpcClient.cancelRequest=function(B){if(JSONRpcClient.async_inflight[B]){JSONRpcClient.async_inflight[B].canceled=true;return true}var A;for(A in JSONRpcClient.async_requests){if(JSONRpcClient.async_requests[A].requestId==B){JSONRpcClient.async_requests[A].canceled=true;return true}}for(A in JSONRpcClient.async_responses){if(JSONRpcClient.async_responses[A].requestId==B){JSONRpcClient.async_responses[A].canceled=true;return true}}return false};JSONRpcClient.prototype._makeRequest=function(B,C,A){var D={};D.client=this;D.requestId=JSONRpcClient.requestId++;var E={};E.id=D.requestId;if(this.objectID){E.method=".obj#"+this.objectID+"."+B}else{E.method=B}E.params=C;if(A){D.cb=A}if(JSONRpcClient.profile_async){D.profile={"submit":new Date()}}D.data=toJSON(E);return D};JSONRpcClient.prototype._sendRequest=function(C){if(C.profile){C.profile.start=new Date()}var B=JSONRpcClient.poolGetHTTPRequest();JSONRpcClient.num_req_active++;B.open("POST",this.serverURL,!!C.cb,this.user,this.pass);try{B.setRequestHeader("Content-type","text/plain")}catch(D){}if(C.cb){var A=this;B.onreadystatechange=function(){if(B.readyState==4){B.onreadystatechange=function(){};var E={"cb":C.cb,"result":null,"ex":null};if(C.profile){E.profile=C.profile;E.profile.end=new Date()}try{E.result=A._handleResponse(B)}catch(F){E.ex=F}if(!JSONRpcClient.async_inflight[C.requestId].canceled){JSONRpcClient.async_responses.push(E)}delete JSONRpcClient.async_inflight[C.requestId];JSONRpcClient.kick_async()}}}else{B.onreadystatechange=function(){}}JSONRpcClient.async_inflight[C.requestId]=C;try{B.send(C.data)}catch(D){JSONRpcClient.poolReturnHTTPRequest(B);JSONRpcClient.num_req_active--;throw new JSONRpcClient.Exception(JSONRpcClient.Exception.CODE_ERR_CLIENT,"Connection failed")}if(!C.cb){return this._handleResponse(B)}};JSONRpcClient.prototype._handleResponse=function(http){if(!this.charset){this.charset=JSONRpcClient._getCharsetFromHeaders(http)}var status,statusText,data;try{status=http.status;statusText=http.statusText;data=http.responseText}catch(e){JSONRpcClient.poolReturnHTTPRequest(http);JSONRpcClient.num_req_active--;JSONRpcClient.kick_async();throw new JSONRpcClient.Exception(JSONRpcClient.Exception.CODE_ERR_CLIENT,"Connection failed")}JSONRpcClient.poolReturnHTTPRequest(http);JSONRpcClient.num_req_active--;if(status!=200){throw new JSONRpcClient.Exception(status,statusText)}var obj;try{eval("obj = "+data)}catch(e){throw new JSONRpcClient.Exception(550,"error parsing result")}if(obj.error){throw new JSONRpcClient.Exception(obj.error.code,obj.error.msg,obj.error.trace)}var res=obj.result;if(res&&res.objectID&&res.JSONRPCType=="CallableReference"){return new JSONRpcClient(this.serverURL,this.user,this.pass,res.objectID,res.javaClass,res.JSONRPCType)}return res};JSONRpcClient.http_spare=[];JSONRpcClient.http_max_spare=8;JSONRpcClient.poolGetHTTPRequest=function(){if(JSONRpcClient.http_spare.length>0){return JSONRpcClient.http_spare.pop()}return JSONRpcClient.getHTTPRequest()};JSONRpcClient.poolReturnHTTPRequest=function(A){if(JSONRpcClient.http_spare.length>=JSONRpcClient.http_max_spare){delete A}else{JSONRpcClient.http_spare.push(A)}};JSONRpcClient.msxmlNames=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","MSXML2.XMLHTTP.5.0","MSXML2.XMLHTTP.4.0","Microsoft.XMLHTTP"];JSONRpcClient.getHTTPRequest=function(){try{JSONRpcClient.httpObjectName="XMLHttpRequest";return new XMLHttpRequest()}catch(B){}for(var A=0;A<JSONRpcClient.msxmlNames.length;A++){try{JSONRpcClient.httpObjectName=JSONRpcClient.msxmlNames[A];return new ActiveXObject(JSONRpcClient.msxmlNames[A])}catch(B){}}JSONRpcClient.httpObjectName=null;throw new JSONRpcClient.Exception(0,"Can't create XMLHttpRequest object")}