﻿var ViewManager;
(function (ViewManager) {
    var Liason = (function () {
        function Liason(key, container, url, urlTitle, pageTitle, loaded, viewUrl) {
            this.Container = container;
            this.Key = key;
            this.Url = url;
            this.UrlTitle = urlTitle;
            this.PageTitle = pageTitle;
            this.Loaded = loaded;
            this.ViewUrl = viewUrl;
        }
        return Liason;
    })();
    ViewManager.Liason = Liason;
    ;

    var View = (function () {
        function View(key, parameters, liason) {
            this.Key = key;
            this.Parameters = parameters;
            this.Liason = liason;
            //can find liason by key
        }
        View.prototype.Show = function () {
            //get the html
            //set the ViewContainer inner html
            var url = "ViewKey" + this.Key.toString();
            var found = sessionStorage.getItem(url);
            var callback = this.SetHTML;
            var liason = this.Liason;
            var view = this;
            if (!found || window["IsDebug"]) {
                Ajax.HttpAction("GET", this.Liason.ViewUrl, {}, function (result) {
                    if (result) {
                        sessionStorage.setItem(url, result);
                        callback(result, liason, view);
                    }
                }, function (result) {
                });
            } else {
                this.SetHTML(found, this.Liason, this);
            }
        };
        View.prototype.SetHTML = function (html, liason, view) {
            liason.Container.innerHTML = html;
            var dataloading = liason.Container.Get(function (e) {
                return e.hasAttribute("data-loadbinding");
            });
            for (var i = 0; i < dataloading.length; i++) {
                Binding.Load(dataloading[i]);
            }
            if (liason.Loaded) {
                liason.Loaded(view);
            }
            if (ViewManager.PostLoaded) {
                ViewManager.PostLoaded(view);
            }
        };
        return View;
    })();
    ViewManager.View = View;
    ViewManager.Views = new Array();
    var Cache = new Array();
    ViewManager.PostLoaded;
    function Initialize(viewLiasons, postLoaded) {
        Cache = viewLiasons;
        ViewManager.PostLoaded = postLoaded;
        window.addEventListener("popstate", ViewManager.BackEvent);
    }
    ViewManager.Initialize = Initialize;
    function BackEvent(e) {
        if (ViewManager.Views.length > 1) {
            ViewManager.Views.splice(ViewManager.Views.length - 1, 1);
        }
        if (ViewManager.Views.length > 0) {
            var viewInfo = ViewManager.Views[ViewManager.Views.length - 1];
            var found = Cache.First(function (o) {
                return o.Key == viewInfo.Key;
            });
            viewInfo.Show();
        } else {
            //do nothing?
        }
    }
    ViewManager.BackEvent = BackEvent;
    function Load(viewKey, parameters) {
        var found = Cache.First(function (o) {
            return o.Key == viewKey;
        });
        if (found) {
            var view = new View(viewKey, parameters, found);
            ViewManager.Views.push(view);
            window.PushState(null, found.UrlTitle(this), found.Url(view));
            view.Show();
        }
    }
    ViewManager.Load = Load;
})(ViewManager || (ViewManager = {}));
//# sourceMappingURL=Browse.js.map
