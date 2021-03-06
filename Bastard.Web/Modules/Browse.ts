module ViewManager {
    export interface ILiason {
        Key: any;
        Url: (View) => string;
        UrlTitle: (View) => string;
        PageTitle: (View) => string;
        Loaded: (View) => void;
        ViewUrl: string;
        IsApi: boolean;
        Container: HTMLElement;
    }
    export class ConventionLiason implements ViewManager.ILiason {
        Key: any;
        Url: (View) => string;
        UrlTitle: (View) => string;
        PageTitle: (View) => string;
        Loaded: (View) => void;
        ViewUrl: string;
        IsApi: boolean;
        Container: HTMLElement;
        constructor(
            key:any,
            viewName: string,
            loaded?: (View) => void) {
            this.Container = null;
            var viewUrl = "/Views/" + viewName + ".html";            
            this.Key = key;            
            this.Loaded = loaded;
            this.ViewUrl = viewUrl;
        }
    };
    export class Liason implements ViewManager.ILiason{
        Key: any;        
        Url: (View) => string;
        UrlTitle: (View) => string;
        PageTitle: (View) => string;
        Loaded: (View) => void;
        ViewUrl: string;
        IsApi: boolean;
        Container: HTMLElement;
        constructor(key: any,
            container:HTMLElement,
            url: (View) => string,
            urlTitle: (View) => string,
            pageTitle: (View) => string,
            loaded: (View) => void,
            viewUrl: string) {
            this.Container = container;
            this.Key = key;
            this.Url = url;
            this.UrlTitle = urlTitle;
            this.PageTitle = pageTitle;
            this.Loaded = loaded;
            this.ViewUrl = viewUrl;            
        }
    };

    export class View {
        Key: any;
        Parameters: Array<any>; 
        Liason: ILiason;                      
        constructor(key: any, parameters:Array<any>, liason:ILiason) {
            this.Key = key;
            this.Parameters = parameters;
            this.Liason = liason;
            //can find liason by key
        }
        Show() {            
            //get the html 
            //set the ViewContainer inner html
            var url = "ViewKey" + this.Key.toString();
            var found = sessionStorage.getItem(url);
            var callback = this.SetHTML;
            var liason = this.Liason;
            var view = this;
            if (!found || window["IsDebug"]) {
                Ajax.View.Retrieve(this.Liason.ViewUrl, function (result) {
                    if (result) {
                        sessionStorage.setItem(url, result);
                        callback(result, liason, view);
                    }
                }, function (result) {
                    });
            }
            else {
                this.SetHTML(found, this.Liason, this);
            }            
        }
        SetHTML(html:string, liason:ILiason, view:ViewManager.View) {
            liason.Container.innerHTML = html; 
            var dataloading = liason.Container.Get(function (e) {
                return e.hasAttribute("data-loadbinding");
            });
            for (var i = 0; i < dataloading.length; i++) {
                Binding.Load(<HTMLElement>dataloading[i]);
            }
            if (liason.Loaded) {
                liason.Loaded(view);
            }
            if (ViewManager.PostLoaded) {
                ViewManager.PostLoaded(view);
            }
        }
    }
    export var Views = new Array<View>();
    var Cache = new Array<ILiason>();
    export var PostLoaded: (View) => void;    
    export function Initialize(viewLiasons: Array<ILiason>, postLoaded?: (View) => void) {        
        AddLiasons(viewLiasons);      
        PostLoaded = postLoaded;
        window.addEventListener("popstate", ViewManager.BackEvent);
    }
    export function AddLiasons(liasions: Array<ILiason>) {
        liasions.forEach(l=> {            
            Cache.Remove(l2=> l2.Key == l.Key);
            Cache.Add(l);
        });
    }
    //    Loaded: (View) => void;
    //ViewUrl: string;
    export function InitializeByConvention(        
        url: (View) => string,
        urlTitle: (View) => string,
        pageTitle: (View) => string,
        viewContainer: HTMLElement,
        conventionLiasons: Array<ConventionLiason>,
        postLoaded?: (View) => void
        ) {
        conventionLiasons.forEach(o=> {
            o.Url = url;
            o.UrlTitle = urlTitle;
            o.PageTitle = pageTitle;
            o.Container = viewContainer;
        });        
        AddLiasons(conventionLiasons);
        if (postLoaded) {
            PostLoaded = postLoaded;
        }
        window.addEventListener("popstate", ViewManager.BackEvent);
    }
    
    export function BackEvent(e) {
        if (ViewManager.Views.length > 1) {
            ViewManager.Views.splice(ViewManager.Views.length - 1, 1);
        }
        if (ViewManager.Views.length > 0) {
            var viewInfo = ViewManager.Views[ViewManager.Views.length - 1];
            var found = <ViewManager.ILiason>Cache.First(function (o) {
                return o.Key == viewInfo.Key;
            });
            viewInfo.Show();            
        }
        else {
            //do nothing?
        }
    }
    export function Load(viewKey, parameters?: Array<string>) {
        var found = <ViewManager.ILiason>Cache.First(function (o) {
            return o.Key == viewKey;
        });
        if (found) {
            var view = new View(viewKey, parameters, found);    
            Views.push(view);
            window.PushState(null, found.UrlTitle(this), found.Url(view));
            view.Show();            
        }
    }
}