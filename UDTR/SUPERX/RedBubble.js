"""
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
function doGet(url)
{
    var request = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest),
    async = false;
    request.open('GET', url, async);
    request.send();
    if (request.status !== 200) {
        var message = 'an error occurred while loading script at url: ' + url + ', status: ' + request.status;
        iimDisplay(message);
        alert(message);
        return "";
    }
    return request.response;
}
// loadScriptFromURL('https://code.jquery.com/jquery-3.2.1.min.js');
// $ = window.$;
// JQuery = window.JQuery;

var i, retcode;
var report;

// doGet("https://www.w3schools.com/jquery/jquery_ajax_get_post.asp");

iimSet("mEmail", "%s");
iimSet("mPass", "%s");
iimSet("mUser", "%s");
iimDisplay("Registering RedBubble...");
retcode = iimPlay("RegAcc.iim");
if(true){
    iimDisplay("Registered RedBubble.");

    iimSet("mAvatar", "%s");
    iimDisplay("Adding avatar...");
    retcode = iimPlay("AddAvatar.iim");

    iimSet("mCover", "%s");
    iimDisplay("Adding cover...");
    retcode = iimPlay("AddCover.iim");

    iimDisplay("Adding social...");
    retcode = iimPlay("AddSocial.iim");

    iimSet("mBio", "%s");
    iimDisplay("Adding bio...");
    retcode = iimPlay("AddBio.iim");

    iimSet("mName", "%s");
    iimSet("mFName", "%s");
    iimSet("mLName", "%s");
    iimSet("mStreet", "%s");
    iimSet("mCity", "%s");
    iimSet("mZip", "%s");
    iimSet("mCountry", "%s");
    iimSet("mBankCode", "%s");
    iimSet("mBankNumber", "%s");
    iimDisplay("Adding payment...");
    retcode = iimPlay("AddPayment.iim");

    iimDisplay("Confirming mail...");
    if(true) // hotmail
    {
        iimPlay("ConfirmMail.iim");
        var link = iimGetExtract();
        alert(link);
    }
    else{ // rumail
        iimPlay("ConfirmMailRU.iim");
    }
    // Upload
    for(var i=1;i<=%d;i++){
        try {
            code="SET !DATASOURCE %s\n";
            code+="SET !DATASOURCE_LINE "+i+"\n";
            code+="SET !DATASOURCE_COLUMNS 1\n";
            code+="SET !EXTRACT {{!COL1}}";
            iimPlayCode(code);
            var camp=iimGetExtract().split('|:|');
            iimSet("mImage", camp[0]);
            iimSet("mTitle", camp[1]);
            iimSet("mDesc", camp[1]);
            iimSet("mTags", camp[2]);
            alert(camp[2]);
            report += camp[1] + ":";
            iimDisplay("Uploading image ("+ i +"): "+camp[1]);
            retcode = iimPlay("UploadRed.iim");
            var link = iimGetExtract();
            report += link + "\n";
        }catch(err) {

        }
    }
    alert(report);
}
else{
    iimDisplay("Register RedBubble Failled!!!");
    iimDisplay("iimGetLastError = " + iimGetLastError());
}


window.close();

"""