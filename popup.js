/*
Author:Vincent Salamera
Date Created: Aug 17, 2020
*/
var UrlSwitcher = (function () {

    'use strict';

    var AemUrl = function (pageUrl) {

        var url = new URL(encodeURI(pageUrl));
        var publicAPIs = {};

        publicAPIs.getUrl = function () {
            return url;
        }

        publicAPIs.getEnv = function () {
            return pageUrl.indexOf('stage64') >= 0 ? 'stage64' :
                pageUrl.indexOf('qa64') >= 0 ? 'qa64' :
                    pageUrl.indexOf('prod64') >= 0 ? 'prod64' :
                        'live';
        }

        publicAPIs.getVersion = function () {
            return pageUrl.indexOf('/content/informa') >= 0 ? 'v1' : 'v2';
        }

        publicAPIs.getMode = function () {
            if (pageUrl.indexOf('editor.html') >= 0) {
                return 'Author';
            }
            else if (pageUrl.indexOf('author') >= 0 && pageUrl.indexOf('?wcmmode=disabled') < 0) {
                return 'Author-wcm';
            }
            else if (pageUrl.indexOf('?wcmmode=disabled') >= 0) {
                return 'View as Published';
            }
            else if (pageUrl.indexOf('author') < 0 && pageUrl.indexOf('adobecqms.net') >= 0) {
                return 'Published';
            }
            else if (pageUrl.indexOf('adobecqms.net') < 0) {
                return 'live';
            }
        }

        publicAPIs.getcontentPath = function () {
            return pageUrl.substring(pageUrl.indexOf('content/')).replace('.html', '').replace('?wcmmode=disabled', '');
        };

        publicAPIs.getcontentParentFolder = function () {
            return publicAPIs.getcontentPath().substring(0, publicAPIs.getcontentPath().indexOf(publicAPIs.getSiteFolder())).split('/')[1];
        };

        publicAPIs.getSiteFolder = function () {
            if(publicAPIs.getVersion() == 'v1'){
                return pageUrl.substring(pageUrl.indexOf('content/')).split('/')[2];
            }
            else{
                return pageUrl.substring(pageUrl.indexOf('content/')).split('/')[3];
            }
        };

        publicAPIs.getpagePath = function () {
            return publicAPIs.getcontentPath().substring(publicAPIs.getcontentPath().indexOf(publicAPIs.getSiteFolder())).replace(publicAPIs.getSiteFolder(), '');
        };

        publicAPIs.switchTo = function (env, mode, folder, pagePath) {
            if (publicAPIs.getEnv() != 'live') {
                return mode == 'Author' ? 'https://author-informa-' + env + '.adobecqms.net/editor.html/' + publicAPIs.getcontentPath() + '.html' :
                    mode == 'View as Published' ? 'https://author-informa-' + env + '.adobecqms.net/' + publicAPIs.getcontentPath() + '.html?wcmmode=disabled' :
                        'https://informa-' + env + '.adobecqms.net/' + publicAPIs.getcontentPath() + '.html';
            } else {
                return mode == 'Author' ? 'https://author-informa-' + env + '.adobecqms.net/editor.html/content/' + folder + pagePath :
                    mode == 'View as Published' ? 'https://author-informa-' + env + '.adobecqms.net/content/' + folder + pagePath + '?wcmmode=disabled' :
                        'https://informa-' + env + '.adobecqms.net/content/' + folder + pagePath;
            }
        };

        publicAPIs.switchToTool = function (tool, crx, dam) {
            if (publicAPIs.getEnv() != 'live') {
                if (publicAPIs.getVersion() == 'v1') {
                    return tool == 'crx' ? 'https://author-informa-' + publicAPIs.getEnv() + '.adobecqms.net/crx/de/index.jsp#/etc/designs/informa/' + crx :
                        tool == 'miscadmin' ? 'https://author-informa-' + publicAPIs.getEnv() + '.adobecqms.net/miscadmin#/etc/designs/informa/' + crx :
                            'https://author-informa-' + publicAPIs.getEnv() + '.adobecqms.net/assets.html/content/dam/' + dam;
                }
                else{
                    return tool == 'crx' ? 'https://author-informa-' + publicAPIs.getEnv() + '.adobecqms.net/crx/de/index.jsp#/apps/informa-designs/' + crx :
                    tool == 'miscadmin' ? 'https://author-informa-' + publicAPIs.getEnv() + '.adobecqms.net/miscadmin#/etc/designs/informa/' + crx :
                        'https://author-informa-' + publicAPIs.getEnv() + '.adobecqms.net/assets.html/content/dam/' + dam;
                }
            } else {
                if (publicAPIs.getVersion() == 'v1'){ 
                    return tool == 'crx' ? 'https://author-informa-prod64.adobecqms.net/crx/de/index.jsp#/etc/designs/' + crx :
                        tool == 'miscadmin' ? 'https://author-informa-prod64.adobecqms.net/miscadmin#/etc/designs/' + crx :
                            'https://author-informa-prod64.adobecqms.net//assets.html/content/dam/' + dam;
                }
                else{
                    return tool == 'crx' ? 'https://author-informa-prod64.adobecqms.net/crx/de/index.jsp#/apps/informa-designs/' + crx :
                    tool == 'miscadmin' ? 'https://author-informa-prod64.adobecqms.net/miscadmin#/etc/designs/' + crx :
                        'https://author-informa-prod64.adobecqms.net//assets.html/content/dam/' + dam;
                }
            }
        };

        publicAPIs.switchToProp = function (siteFolder) {
            if (publicAPIs.getEnv() != 'live') {
                return 'https://author-informa-' + publicAPIs.getEnv() + '.adobecqms.net/mnt/overlay/wcm/core/content/sites/properties.html?item=/' + encodeURI(publicAPIs.getcontentPath());
            }
            else {
                return 'https://author-informa-prod64.adobecqms.net/mnt/overlay/wcm/core/content/sites/properties.html?item=/content/' + siteFolder;
            }
        };

        publicAPIs.switchToAdmin = function (adminType, siteFolder) {
            if (publicAPIs.getEnv() != 'live') {
                return adminType == "viewadmin" ? 'https://author-informa-' + publicAPIs.getEnv() + '.adobecqms.net/sites.html/' + encodeURI(publicAPIs.getcontentPath()) :
                    'https://author-informa-' + publicAPIs.getEnv() + '.adobecqms.net/siteadmin#/' + encodeURI(publicAPIs.getcontentPath())
            }
            else {
                return adminType == "viewadmin" ? 'https://author-informa-prod64.adobecqms.net/sites.html/content/' + siteFolder :
                    'https://author-informa-prod64.adobecqms.net/siteadmin#/content/' + siteFolder 
            }
        };
        return publicAPIs;
    };



    var init = function (url) {
        loadTabState();
        loadUser();
        var page = new AemUrl(url);
        var btns = [].slice.call(document.getElementsByClassName('button'));
        var tabList = document.getElementById('tab-option-list');
        var loginform = document.getElementById('login-form');
        var submit = document.getElementById('submit');
        var loginBtn = document.getElementById('login');
        var logoutBtn = document.getElementById('logout');
        var miscBtn = document.getElementById('miscAdminBtn');

        if(page.getVersion() == 'v2'){
            miscBtn.remove();
        }
        tabList.onchange = function () {
            saveTabState();
        };

        btns.forEach(function (element) {
            if (page.getMode() !== 'Author' && page.getMode() !== 'View as Published' && page.getMode() !== 'Published' && page.getMode() !== 'live' && page.getMode() !== 'Author-wcm') {
                element.classList.add("disabled");
            }
            if (element.name == page.getEnv() && element.value == page.getMode()) {
                element.classList.add("blue");
                element.classList.add("disabled");
            }

            if (element.classList.contains('switch-btn')) {
                element.addEventListener('click', function (el) {
                    chrome.tabs.query({
                        active: true,
                        currentWindow: true
                    }, function (tab) {
                        if (page.getEnv() != 'live') {
                            openPage(page.switchTo(el.target.name, el.target.value));
                        } else {
                            element.classList.add("loading");
                            var $url = new URL(page.getUrl());
                            request(function (response) {
                                var req;
                                try {
                                    req = JSON.parse(response).values.find(function (el) {
                                        return el[1] === $url.host;
                                    });
                                    var siteFolderPath = req[2] + req[3];
                                    openPage(page.switchTo(el.target.name, el.target.value, siteFolderPath, $url.pathname))
                                }
                                catch (e) {
                                    document.getElementById('errorMsg').innerHTML = 'The site list did not contain the Site folder for this website.';
                                    document.getElementById('error-btn-msg').innerHTML = 'Add Site folder to the List';
                                    $('.error-modal').modal('show');
                                }
                                element.classList.remove("loading");
                            });
                        }
                    });
                });
            }

            if (element.classList.contains('live-button')) {
                element.addEventListener('click', function (el) {
                    element.classList.add("loading");
                    request(function (response) {
                        var req;
                        try {
                            req = JSON.parse(response).values.find(function (el) {
                                return el[3] === page.getSiteFolder();
                            });
                            var $url = new URL('http://'+req[1]);
                            openPage($url + page.getpagePath().substr(1) + '.html');
                        }
                        catch (e) {
                            document.getElementById('errorMsg').innerHTML = 'The site list did not contain the live Url for this website.';
                            document.getElementById('error-btn-msg').innerHTML = 'Add Url to the List';
                            $('.error-modal').modal('show');
                        }
                        element.classList.remove("loading");
                    });
                });
            }

            if (element.classList.contains('prop-btn')) {
                element.addEventListener('click', function (el) {
                    if (page.getEnv() != 'live') {
                        openPage(page.switchToProp());
                    } else {
                        element.classList.add("loading");
                        var $url = new URL(page.getUrl());
                        request(function (response) {
                            var req;
                            try {
                                req = JSON.parse(response).values.find(function (el) {
                                    return el[1] === $url.host;
                                });
                                openPage(page.switchToProp(req[2] + req[3] + $url.pathname.replace('.html','')));
                            }
                            catch (e) {
                                document.getElementById('errorMsg').innerHTML = 'The site list did not contain the Site folder for this website.';
                                document.getElementById('error-btn-msg').innerHTML = 'Add Site folder to the List';
                                $('.error-modal').modal('show');
                            }
                            element.classList.remove("loading");
                        });
                    }
                });
            }

            if (element.classList.contains('admin-btn')) {
                element.addEventListener('click', function (el) {
                    if (page.getEnv() != 'live') {
                        openPage(page.switchToAdmin(element.name));
                    } else {
                        element.classList.add("loading");
                        var $url = new URL(page.getUrl());
                        request(function (response) {
                            var req;
                            try {
                                req = JSON.parse(response).values.find(function (el) {
                                    return el[1] === $url.host;
                                });
                                
                                openPage(page.switchToAdmin(element.name, req[2] + req[3] + $url.pathname.replace('.html','')));
                            }
                            catch (e) {
                                document.getElementById('errorMsg').innerHTML = 'The site list did not contain the Site folder for this website.';
                                document.getElementById('error-btn-msg').innerHTML = 'Add Site folder to the List';
                                $('.error-modal').modal('show');
                            }
                            element.classList.remove("loading");
                        });
                    }
                });
            }

            if (element.classList.contains('tools-btn')) {
                element.addEventListener('click', function (el) {
                    element.classList.add("loading");
                    var $url = new URL(page.getUrl());
                    request(function (response) {
                        var req;
                        var modalMessage = '';
                        var modalBtnlabel = '';
                        modalMessage = element.name == 'dam' ? 'The site list did not contain the DAM folder for this website.' :
                            element.name == 'crx' ? 'The site list did not contain the Design folder for this website.' :
                                'The site list did not contain the Design folder for this website.';

                        modalBtnlabel = element.name == 'dam' ? 'Add DAM folder to the List' :
                            element.name == 'crx' ? 'Add Design folder to the List' :
                                'Add Design folder to the List';
                        try {
                            req = JSON.parse(response).values.find(function (el) {
                                if (page.getEnv() != 'live') {
                                    return el[3] === page.getSiteFolder();
                                } else
                                    return el[1] === $url.host;
                            });
                            var cssFolder = req[4];
                            var damFolder = req[5] + req[6];
                            openPage(page.switchToTool(el.target.value, cssFolder, damFolder));
                        }
                        catch (e) {
                            document.getElementById('errorMsg').innerHTML = modalMessage;
                            document.getElementById('error-btn-msg').innerHTML = modalBtnlabel;
                            $('.error-modal').modal('show');
                        }
                        element.classList.remove("loading");
                    });
                });
            }

            if (element.classList.contains('add-event')) {
                element.addEventListener('click', function (el) {
                    openPage('https://docs.google.com/spreadsheets/d/1aac15kxvgnrks5rkZ-PAGVFSpYBdhznUhE3VgrTeK-A/edit#gid=0');
                });
            }
        });

        submit.addEventListener('click', function (el) {
            $(".ui.form").form({
                fields: {
                    username: {
                        identifier: 'username',
                        rules: [
                            {
                                type: 'empty'
                            },
                            {
                                type: 'isExactly[admin]',
                                prompt: 'Invalid username'
                            },
                        ]
                    },
                    password: {
                        identifier: 'password',
                        rules: [
                            {
                                type: 'empty'
                            },
                            {
                                type: 'isExactly[informa]',
                                prompt: 'Invalid password'
                            },
                        ]
                    }
                },
                onSuccess: function () {
                    saveUser();
                    isLoggedIn();
                    $('.login-modal').modal('hide');
                }
            }).submit(function (e) {
                e.preventDefault();
            });
        });

        loginBtn.addEventListener('click', function (el) {
            $('.ui.form').trigger("reset");
            $('.ui.form .field.error').removeClass("error");
            $('.ui.form.error').removeClass("error");
            $('.login-modal').modal('show');
        });

        logoutBtn.addEventListener('click', function (el) {
            logoutUser();
        });

        chrome.commands.onCommand.addListener((command,tab) => {

            if (command === 'author') {
                document.getElementById( shortcut(page.getEnv()) + "Author").click();
            }
            else if(command === 'vap') {
                document.getElementById( shortcut(page.getEnv()) + "ViewAsPublished").click();
            }
            else if(command === 'publish') {
                document.getElementById( shortcut(page.getEnv()) + "Published").click();
            }

            function shortcut(env){
                if (env == 'stage64') {
                    return 'stage';
                }
                else if(env == 'qa64') {
                    return 'qa';
                }
                else if(env == 'prod64') {
                    return 'prod';
                }
            }
        });

    };

    var onWindowLoad = function () {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tab) {
            init(tab[0].url);
        });
    };

    function request(callback) {
        var xobj = new XMLHttpRequest();
        xobj.open('GET', 'https://sheets.googleapis.com/v4/spreadsheets/1aac15kxvgnrks5rkZ-PAGVFSpYBdhznUhE3VgrTeK-A/values/Sheet1?alt=json&key=AIzaSyCItVecOcQfOWc9H03W49V5jEKbt3zlh7o', true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    };

    function loadTabState() {
        var tabSelected = '';
        chrome.storage.local.get(['tabSelected'], function (result) {
            tabSelected = result.tabSelected;
            if (tabSelected !== undefined) {
                document.getElementById(tabSelected).checked = true;
            } else {
                saveTabState();
            }
        });
    };

    function loadUser() {
        var login = '';
        chrome.storage.local.get(['login'], function (result) {
            login = result.login;
            if (login == "islogin") {
                isLoggedIn();
            }
            else {
                isLoggedOut();
            }

        });
    };

    function saveUser() {
        chrome.storage.local.set({
            'login': 'islogin'
        });
    };

    function logoutUser() {
        chrome.storage.local.set({
            'login': ''
        });
        isLoggedOut();
    };

    function isLoggedIn() {
        var loginElements = [].slice.call(document.getElementsByClassName('login-element'));
        document.getElementById('login').classList.add("hidden");
        document.getElementById('logout').classList.remove("hidden");
        loginElements.forEach(function (element) {
            element.classList.remove("hidden");
        });
    };

    function isLoggedOut() {
        var loginElements = [].slice.call(document.getElementsByClassName('login-element'));
        document.getElementById('logout').classList.add("hidden");
        document.getElementById('login').classList.remove("hidden");
        loginElements.forEach(function (element) {
            element.classList.add("hidden");
        });
    };

    function saveUser() {
        chrome.storage.local.set({
            'login': 'islogin'
        });
    };

    function saveTabState() {
        chrome.storage.local.set({
            'tabSelected': document.querySelector('#tab-option-list input:checked').id
        });
    };

    function openPage($url) {
        document.querySelector('#tab-option-list input:checked').value == 'New Tab' ? chrome.tabs.create({ url: $url })
            : document.querySelector('#tab-option-list input:checked').value == 'New Window' ? chrome.windows.create({ url: $url })
                : chrome.tabs.update({ url: $url })
    }



    return onWindowLoad

})();


window.onload = UrlSwitcher;