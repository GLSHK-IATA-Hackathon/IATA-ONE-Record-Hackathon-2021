var addressBookSearchTimeoutValue = 30000;
var addressBookSearchTimeoutHandle = -1;

//Get address book result
function GetAddressBook(addrCode, count) {
    connectHub(function () {
        startAddressBookSearchAction();
        if (typeof count === 'undefined' || count == null) {
            count = -1;
        }
        bookingHub.server.getAddressBookList(addrCode, count);
    });
}

bookingHub.client.loadAddressBookResult = function (res, count) {
    console.log("Received address book result");
    console.log(res);

    stopAddressBookSearchAction();

    var addressBookList = [];
    var addressBookListResult = [];
    if (typeof res !== 'undefined' && res != null) {
        addressBookList = JSON.parse(res);
    }

    if (count > 0 && addressBookList.length > count) {
        for (var i = 0; i < count; i++) {
            addressBookListResult.push(addressBookList[i]);
        }
    } else {
        addressBookListResult = addressBookList;
    }

    localStorage.setItem("contact_addr_book", JSON.stringify(addressBookListResult));

    $("#bkd_def_shipperconsignee").triggerHandler("bindAddressBookSearchResult");

    refreshModuleTranslation();
}

function startAddressBookSearchAction() {
    showAddressBookLoading();
    startAddressBookTimeout();
}

function stopAddressBookSearchAction() {
    hideAddressBookLoading();
    if (addressBookSearchTimeoutHandle != -1) {
        clearTimeout(addressBookSearchTimeoutHandle);
        addressBookSearchTimeoutHandle = -1;
    }
    //disconnectHub();
}

function startAddressBookTimeout() {
    clearTimeout(addressBookSearchTimeoutHandle);
    addressBookSearchTimeoutHandle = setTimeout(function () {
        addressBookTimeout();
    }, addressBookSearchTimeoutValue);
}

function addressBookTimeout() {
    stopAddressBookSearchAction();
    showAddressBookError("Load address book failed");
    addressBookSearchTimeoutHandle = -1;
    hideAddressBookLoading();
}

function showAddressBookLoading() {
    $("#addressBookResultStatusWrapper .loading-main").removeClass("disabled");
}

function hideAddressBookLoading() {
    $("#addressBookResultStatusWrapper .loading-main").addClass("disabled");
}

function showAddressBookError(msg) {
    $("#addressBookResultStatusWrapper .error-box").removeClass("disabled");

    if (typeof msg !== 'undefined' && msg != null) {
        $("#addressBookResultStatusWrapper .error-box .error-message").text(msg);
    }
}

function hideAddressBookError() {
    $("#addressBookResultStatusWrapper .error-box").addClass("disabled");
    $("#addressBookResultStatusWrapper .error-box .error-message").text("");
}

//Add address book
var addressBookAddTimeoutHandle = -1;
var addressBookAddTimeoutValue = 30000;

function startAddressBookAddAction() {
    //showAddressBookAddLoading();
    startAddressBookAddTimeout();
}

function stopAddressBookAddAction() {
    hideAddressBookAddLoading();
    if (addressBookAddTimeoutHandle != -1) {
        clearTimeout(addressBookAddTimeoutHandle);
        addressBookAddTimeoutHandle = -1;
    }
    //disconnectHub();
}

function startAddressBookAddTimeout() {
    clearTimeout(addressBookAddTimeoutHandle);
    addressBookAddTimeoutHandle = setTimeout(function () {
        addressBookAddTimeout();
    }, addressBookAddTimeoutValue);
}

function addressBookAddTimeout() {
    stopAddressBookAddAction();
    alert("Add to address book failed. Timeout occurred");
    addressBookAddTimeoutHandle = -1;
    hideAddressBookAddLoading();
}

function showAddressBookAddLoading(id) {
    $("#contact_addressbook_loading_" + id).show();
    $("#contact_btn_addressbook_ins_" + id).hide();
}

function hideAddressBookAddLoading() {
    $("[id^=contact_addressbook_loading_]").hide();
    $("[id^=contact_btn_addressbook_ins_]").show();
}

function AddAddressBookContact(contact) {
    connectHub(function () {
        startAddressBookAddAction();
        bookingHub.server.addAddressBookContact(contact);
    });
}

bookingHub.client.addAddressBookResponse = function (res, msg) {
    console.log("Received address book add response");
    console.log("res: " + res);
    console.log("msg: " + msg);
    stopAddressBookAddAction();
    if (res == true) {
        $(".contact_addressbook_code").val("");
        alert("Record successfully added to address book");
    }
    else if (typeof msg !== 'undefined' && msg != null) {
        alert("Failed to add record to address book. " + msg);
    }

}