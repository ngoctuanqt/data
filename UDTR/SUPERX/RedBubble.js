function loadScriptFromURL(url) {
    var request = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest),
    async = false;
    request.open('GET', url, async);
    request.send();
    if (request.status !== 200) {
        var message = 'an error occurred while loading script at url: ' + url + ', status: ' + request.status;
        iimDisplay(message);
        alert(message);
        return false;
    }
    eval(request.response);
    return true;
}
// function sleep(ms) {
//    return new Promise(resolve => setTimeout(resolve, ms));
// }
// function doGet(url)
// {
//     var request = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest);
//     var async = false;
//     request.open('GET', url, async);
//     request.send();
//     if (request.status !== 200) {
//         var message = 'an error occurred while loading script at url: ' + url + ', status: ' + request.status;
//         // iimDisplay(message);
//         alert(message);
//         return "";
//     }
//     return request.response;
// }
function doPost(url, jsonData, callback)
{
    var xhr = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest);
    var async = false;
    xhr.open("POST", url, async);
    xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onreadystatechange=function() 
	{
	  if(xhr.readyState==4)
	  {
		 if (xhr.status !== 200) {
			var message = 'an error occurred while loading script at url: ' + url + ', status: ' + xhr.status;
			alert(message);
			return "";
		}
        // alert("responseText 1 " + this.responseText);
        callback(xhr.responseText);
	  }
	}
    xhr.send(JSON.stringify(jsonData));
}
// loadScriptFromURL("https://www.promisejs.org/polyfills/promise-7.0.4.min.js");
// loadScriptFromURL('https://code.jquery.com/jquery-3.2.1.min.js');
// $ = window.$;
// JQuery = window.JQuery;

var i, retcode;
var report;

// doGet("https://www.w3schools.com/jquery/jquery_ajax_get_post.asp");

// while(!flag) {
// 	sleep(10000);
// }

iimSet("mEmail", "%(mEmail)s");
iimSet("mPass", "%(mPass)s");
iimSet("mUser", "%(mUser)s");
iimDisplay("Registering RedBubble...");
retcode = iimPlay("RegAcc.iim");
var flag = false;
if(true){
    iimDisplay("Registered RedBubble.");
    var jsonData = {
        "Email":"%(mEmail)s",
        "Pass":"%(mPass)s",
        "Service" :"redbubble",
        "RealAll": false
    }
    
    doPost("http://180.93.137.220/api/Mail/ReadMail", jsonData, response => {
        // alert(response);
        if(response != "")
        {
            var res = JSON.parse(response);
            if(res.Result)
            {
                var url = res.Mails[0].Result
                window.open(url, '_blank');
                flag = true;
            }
        }
    });

    iimSet("mName", "%(mName)s");
    iimSet("mFName", "%(mFName)s");
    iimSet("mLName", "%(mLName)s");
    iimSet("mStreet", "%(mStreet)s");
    iimSet("mCity", "%(mCity)s");
    iimSet("mZip", "%(mZip)s");
    iimSet("mCountry", "%(mCountry)s");
    iimSet("mBankCode", "%(mBankCode)s");
    iimSet("mBankNumber", "%(mBankNumber)s");
    iimDisplay("Adding payment...");
    retcode = iimPlay("AddPayment.iim");
    
    iimSet("mBio", "%(mBio)s");
    iimDisplay("Adding bio...");
    retcode = iimPlay("AddBio.iim");

    iimSet("mAvatar", "%(mAvatar)s");
    iimDisplay("Adding avatar...");
    retcode = iimPlay("AddAvatar.iim");

    iimSet("mCover", "%(mCover)s");
    iimDisplay("Adding cover...");
    retcode = iimPlay("AddCover.iim");

    iimDisplay("Adding social...");
    retcode = iimPlay("AddSocial.iim");
  
    iimSet("mEmail", "%(mEmail)s");
    iimSet("mPass", "%(mPass)s");
    if(!flag)
    {
        if(%(isHotmail)s) // isHotmail
        {
            iimDisplay("Confirming mail...");
            iimPlay("ConfirmMail.iim");
            var link = iimGetExtract();
            //alert(link);
        }
        else{ // rumail
            iimDisplay("Confirming mail RU...");
            iimPlay("ConfirmMailRU.iim");
        }
    }
    // Upload
    for(var i=1;i<=%(uploadNumber)d;i++){ //uploadNumber
        try {
            code="SET !DATASOURCE_DELIMITER ;\n";
            code+="SET !DATASOURCE %(dataPath)s\n"; //dataPath
            code+="SET !DATASOURCE_LINE "+i+"\n";
            // code+="SET !DATASOURCE_COLUMNS 1\n";
            code+="SET !EXTRACT {{!COL1}}|:|{{!COL2}}|:|{{!COL3}}|:|{{!COL4}}";
            iimPlayCode(code);
            var camp=iimGetExtract().split('|:|');
            iimSet("mImage", camp[0]);
            iimSet("mTitle", camp[1]);
            iimSet("mDesc", camp[2]);
            iimSet("mTags", camp[3]);
            // alert(camp[3]);
            report += camp[1] + ":";
            iimDisplay("Uploading image ("+ i +"): "+camp[1]);
            retcode = iimPlay("UploadRed.iim");
            var link = iimGetExtract();
            report += link + "\n";
        }catch(err) {

        }
    }
    code="SET !EXTRACT NULL\n";
    code+="ADD !EXTRACT "+ report+"\n";
    code+="SAVEAS TYPE=EXTRACT  FOLDER=\"%(retPath)s\" FILE=result.txt\n";
    iimPlayCode(code);
            //alert(report);
}
else{
    iimDisplay("Register RedBubble Failled!!!");
    iimDisplay("iimGetLastError = " + iimGetLastError());
}

window.close();
