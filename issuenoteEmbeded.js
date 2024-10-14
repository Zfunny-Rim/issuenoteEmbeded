	define( ["qlik", "jquery"],
		function (qlik, $) {
			var isInit = false;
			var gUserId = '';
			var gSerialSn = '';
			var gKeyValue = '';
			var gStatusCode = '';
			var gsumDesc = '';

			return {
				support : {
					snapshot: false,
					export: false,
					exportData : false
				},
				definition: {
					type: "items",
					component: "accordion",
					items: {
						addons: { 
							uses: "addons", 
							items: { 
								dataHandling: { 
										uses: "dataHandling" 
								}
							}
							},
						about: {
							label: "Variable setting"
							,type: "items"
							,items: [
								{
									label: "URL",
									component: "string",
									expression: "optional",
									ref: "url",
									defaultValue: ""
								},
								{
									label: "Result",
									component: "string",
									expression: "optional",
									ref: "result",
									defaultValue: "vResult"
								},
								{
									label: "Key Variable",
									component: "string",
									expression: "optional",
									ref: "keyvariable",
									defaultValue: "vKey"
								},
								{
									label: "Serial Number Variable",
									component: "string",
									expression: "optional",
									ref: "snvariable",
									defaultValue: "vSerial"
								}
							]
						},
						settings: {
							uses: "settings"
						}
					}
				},
				paint: function ($element, layout) {
					var ownId = this.options.id;
					var styleId = ownId == undefined ? " " : "div[tid=" + ownId + "] ";
					var maxlength= 3000;

					$("#" + ownId).remove();
					var style = 'div[tid="' + ownId + '"] .qv-object-' + ownId + 
					', div[tid="' + ownId + '"] .qv-inner-object:not(.visual-cue) {\n    border: none!important;\n    background: none!important;\n}\n'
					+ '#' + ownId + '_title {\n    height: 2%!important;\n}\n'
					+ '#click' + ownId
					+ `
					{
						display: table;
						background-color: #cc7490;
						color: white;
						padding: 0px 0px;
						border: none;
						border-radius: 4px;
						cursor: pointer;
						margin-right: 0px;
						box-shadow: 0 4px 8px rgba(0,0,0,0.20);
						width: 100%;
						height: 100%;
						outline: none;
					}
					`
					+ styleId + 'button'
					+ `
					{
						display: table-cell;
						background-color: #cc7490;
						color: white;
						padding: 0px 0px;
						border: none;
						margin-right: 0px;
						vertical-align: middle;
						text-align: center;
					}
					`
					+ styleId + 'body'
					+ `
					{
						font-family: Arial, sans-serif;
					}
					`
					+ styleId + '.top-buttons'
					+ `
					{
						display: flex;
						justify-content: flex-end;
						align-items: center;
						margin-bottom: 20px;
					}
					`
					+ styleId + '.container'
					+ `
					{
						max-width: 600px;
						margin: auto;
						border: 1px solid #ccc;
						padding: 20px;
						border-radius: 8px;
						background-color: #f9f9f9;
						max-height: 600px; /* 최대 높이 설정 */
					}
					`
					+ styleId + '.section-title'
					+ `
					{
						background-color: #e34975;
						color: #ffffff;
						padding: 5px;
						margin-bottom: 10px;
						font-weight: bold;
					}
					`
					+ styleId + '.section-content'
					+ `
					{
						margin-bottom: 20px;
					}
					`
					+ styleId + '.inline-elements'
					+ `
					{
						display: flex;
						gap: 20px;
						align-items: center;
					}
					`
					+ styleId + 'label'
					+ `
					{
						font-weight: bold;
					}
					`
					+ styleId + 'select, textarea'
					+ `
					{
						padding: 8px 5px;
						border-radius: 4px;
						border: 1px solid #ccc;
					}
					`
					+ styleId + 'select'
					+ `
					{
						width: 150px;
					}
					`
					+ styleId + 'textarea'
					+ `
					{
						width: 97%;
						height: 150px;
						resize: none;
					}
					`
					+ styleId + '.max-text-length'
					+ `
					{
						margin: 5px 5px;
						font-size: 12px;
						text-align: right;
					}
					`
					+ styleId + '.table-container'
					+ `
					{
						max-height: 250px; /* 테이블 컨테이너의 최대 높이 설정 */
						overflow-y: auto; /* 테이블 컨테이너에 스크롤바 추가 */
					}
					`
					+ styleId + 'table'
					+ `
					{
						width: 100%;
						border-collapse: collapse;
						margin-bottom: 20px;
					}
					`
					+ styleId + 'table, th, td'
					+ `
					{
						border: 1px solid #ccc;
						text-align: center;
					}
					`
					+ styleId + 'th, td'
					+ `
					{
						padding: 10px;
					}
					`
					+ styleId + '.btn'
					+ `
					{
						background-color: #5ad570;
						color: white;
						padding: 10px 20px;
						border: none;
						border-radius: 4px;
						cursor: pointer;
						margin-right: 10px;
						box-shadow: 0 4px 8px rgba(0,0,0,0.20);
						outline: none;
					}
					`
					+ styleId + '.btn:hover'
					+ `
					{
						opacity: 0.8;
					}
					`
					+ styleId + '.close-btn'
					+ `
					{
						background-color: #ff3d3d;	
						margin-right: 0;
					}
					`
					+ styleId + '.connect-btn'
					+ `
					{
						background-color: #e9ae3f;
						display: flex;
					}
					`
					$("<style id = '" + ownId + "'>").html(style).appendTo("head");
					
					$element.html(
						`
							<div class="top-buttons">
							<button class="save-btn btn" id="save">SAVE</button>
							<button class="close-btn btn" id="close">X</button>
							</div>
							
							<div class="section-title">Issue check</div>
							<div class="section-content">
							<div class="inline-elements">
								<label for="status">Status</label>
								<select id="status">
								<option value="" disabled>선택하세요</option>
								<option value="N">No Issue</option>
								<option value="I">Improving</option>
								<option value="C">Improvement Completed</option>
								<option value="M">Monitoring</option>
								</select>
							</div>
							</div>

							<div class="section-title">Issue Summary</div>
							<div class="section-content">
							<textarea id="issue-summary" 
							placeholder="내용작성 (이슈칼럼)" 
							maxlength="3000" ></textarea>
							<p class="max-text-length"><span class="textLength">0</span> / 3000자</p>
							</div>

							<div>
							<button class="connect-btn btn" id="connectQMS">Connect QMS</button>
							</div>
						</div>
						`
					);
					if(!isInit){
						initializeExtension();
					}else{
						setDetailValue();
					}
					initEventListener();
					
					function getBasisYm(){
						var today = new Date();
					
						var year = today.getFullYear();
						var month = ('0' + (today.getMonth() + 1)).slice(-2);
						var basisYm = year + month;
					
						return basisYm;
					}

					function initializeExtension(){
						var app = qlik.currApp(this);
						var API_URL = layout.url;
						var qKeyValueName = layout.keyvariable;
						var qSerialSnName = layout.snvariable;

						var qFormula = "'$(=SubField(OSUser(), '=', 3))'";
						app.model.enigmaModel.evaluate(qFormula).then(qUserId => {
							gUserId = qUserId;
							app.variable.getContent(qKeyValueName, reply => {
								var qFormula = reply.qContent.qString;
								app.model.enigmaModel.evaluate(qFormula).then(qKeyValue => {
									gKeyValue = qKeyValue;
									app.variable.getContent(qSerialSnName, reply => {
										var qFormula = reply.qContent.qString;
										app.model.enigmaModel.evaluate(qFormula).then(qSerialSn => {
											gSerialSn = qSerialSn;

											var basisYm = getBasisYm();
						
											console.log(gUserId);
											console.log(gKeyValue);
											console.log(gSerialSn);

											try{
												fetch(API_URL + "issueNote/detail", {
												method: "POST",
												headers: {
												"Content-Type": "application/json",
												},
												body: JSON.stringify({
													basisYm: basisYm,
													judgeBasisSn: gSerialSn,
													surrogateKeyCode: gKeyValue,
												}),
											})
											.then((response) => response.json())
											.then(response => {
												console.log(response);
												if (response.httpStatusCode === 200 || response.httpStatusCode === 304){
													var resultDetail = response.body.detail;
													if(resultDetail){
														gStatusCode = resultDetail.progressStatusCode;
														gSumDesc = resultDetail.issueSumDesc;
														setDetailValue();
													} 
												}
											})
											}catch(error){
												alert(error.message);
											}finally{
												isInit = true;
											}
										});
									});
								});
							});
						});
					}
					function setDetailValue(){
						document.getElementById('issue-summary').value = gSumDesc;
						if(gStatusCode){
							document.getElementById("status").value = gStatusCode;
						}else{
							document.getElementById("status").value = '';
						}
					}
					function keyUpEvent(){
						var content = $('#issue-summary').val();

						if(content.length == 0 || content == ""){
							$(".textLength").text('0');
						}else{
							$(".textLength").text(content.length);
						}
					
						if (content.length > maxlength) {
							$(this).val($(this).val().substring(0, maxlength));
						}
					}
					function closeClickEvent(){
						window.close();
					}
					function qmsClickEvent(){
						console.log('Unimplemented1');
					}
					function saveClickEvent(){
						var app = qlik.currApp(this);
							var API_URL = layout.url;

							var sep = '#qVar@';
							var status = $('#status').val();
							var basisYm = getBasisYm();
							var issueSummary = $('#issue-summary').val();
							var qResultName = layout.result;

							try{
								fetch(API_URL + "issueNote/save", {
									method: "POST",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify({
										basisYm: basisYm,
										judgeBasisSn: gSerialSn,
										surrogateKeyCode: gKeyValue,
										progressStatusCode: status,
										issueSumDesc: issueSummary.replace(/\n/g, "\\n"),
										userId: gUserId
									}),
								})
								.then((response) => response.json())
								.then((data) => {
									console.log(data);
									if(data.httpStatusCode == 200){
										var qResult = 'i' + sep + gKeyValue + sep + issueSummary + sep + status;
									
										app.variable.setStringValue(qResultName, qResult)
										.then(()=>{
											app.doReload(0, true)
											.then((result)=>{
												console.log(result);
												app.doSave()
													.then((result)=>{
														console.log(result);
														alert('Issue Saved!')
														window.close();
													})
													.catch((error)=>{
														console.log(error);
														alert('doSave Error');
													})
											})
											.catch((error)=>{
												console.log(error);
												alert('doReaload Error');
											})
										})
										.catch((error)=>{
											console.log(error);
											alert('setStringValue Error');
										})	
									}
								})
							}catch(error){
								alert(error.meesage)
							}
					}
					function initEventListener(){
						document.getElementById("issue-summary").removeEventListener("keyup", keyUpEvent);
						document.getElementById("close").removeEventListener("click", closeClickEvent);
						document.getElementById("connectQMS").removeEventListener("click", qmsClickEvent);
						document.getElementById("save").removeEventListener("click", saveClickEvent);

						document.getElementById("issue-summary").addEventListener("keyup", keyUpEvent);
						document.getElementById("close").addEventListener("click", closeClickEvent);
						document.getElementById("connectQMS").addEventListener("click", qmsClickEvent);
						document.getElementById("save").addEventListener("click", saveClickEvent);
					}

					return qlik.Promise.resolve();
				},
				beforeDestroy: function() {
					var ownId = this.options.id;
					console.log('DESTROY!')
					$("#" + ownId).remove();
					isInit = false;
				}
			};
		});