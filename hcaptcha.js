var hcaptcha = function () {
    "use strict";

    function e(e) {
        var t = this.constructor;
        return this.then(function (n) {
            return t.resolve(e()).then(function () {
                return n
            })
        }, function (n) {
            return t.resolve(e()).then(function () {
                return t.reject(n)
            })
        })
    }

    function t(e) {
        return new this(function (t, n) {
            if (!e || void 0 === e.length) return n(new TypeError(typeof e + " " + e + " is not iterable(cannot read property Symbol(Symbol.iterator))"));
            var i = Array.prototype.slice.call(e);
            if (0 === i.length) return t([]);
            var o = i.length;

            function r(e, n) {
                if (n && ("object" == typeof n || "function" == typeof n)) {
                    var a = n.then;
                    if ("function" == typeof a) return void a.call(n, function (t) {
                        r(e, t)
                    }, function (n) {
                        i[e] = {
                            status: "rejected",
                            reason: n
                        }, 0 == --o && t(i)
                    })
                }
                i[e] = {
                    status: "fulfilled",
                    value: n
                }, 0 == --o && t(i)
            }
            for (var a = 0; a < i.length; a++) r(a, i[a])
        })
    }
    var n = setTimeout,
        i = "undefined" != typeof setImmediate ? setImmediate : null;

    function o(e) {
        return Boolean(e && void 0 !== e.length)
    }

    function r() {}

    function a(e) {
        if (!(this instanceof a)) throw new TypeError("Promises must be constructed via new");
        if ("function" != typeof e) throw new TypeError("not a function");
        this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], u(e, this)
    }

    function s(e, t) {
        for (; 3 === e._state;) e = e._value;
        0 !== e._state ? (e._handled = !0, a._immediateFn(function () {
            var n = 1 === e._state ? t.onFulfilled : t.onRejected;
            if (null !== n) {
                var i;
                try {
                    i = n(e._value)
                } catch (e) {
                    return void h(t.promise, e)
                }
                c(t.promise, i)
            } else(1 === e._state ? c : h)(t.promise, e._value)
        })) : e._deferreds.push(t)
    }

    function c(e, t) {
        try {
            if (t === e) throw new TypeError("A promise cannot be resolved with itself.");
            if (t && ("object" == typeof t || "function" == typeof t)) {
                var n = t.then;
                if (t instanceof a) return e._state = 3, e._value = t, void l(e);
                if ("function" == typeof n) return void u((i = n, o = t, function () {
                    i.apply(o, arguments)
                }), e)
            }
            e._state = 1, e._value = t, l(e)
        } catch (t) {
            h(e, t)
        }
        var i, o
    }

    function h(e, t) {
        e._state = 2, e._value = t, l(e)
    }

    function l(e) {
        2 === e._state && 0 === e._deferreds.length && a._immediateFn(function () {
            e._handled || a._unhandledRejectionFn(e._value)
        });
        for (var t = 0, n = e._deferreds.length; t < n; t++) s(e, e._deferreds[t]);
        e._deferreds = null
    }

    function d(e, t, n) {
        this.onFulfilled = "function" == typeof e ? e : null, this.onRejected = "function" == typeof t ? t : null, this.promise = n
    }

    function u(e, t) {
        var n = !1;
        try {
            e(function (e) {
                n || (n = !0, c(t, e))
            }, function (e) {
                n || (n = !0, h(t, e))
            })
        } catch (e) {
            if (n) return;
            n = !0, h(t, e)
        }
    }
    a.prototype.catch = function (e) {
        return this.then(null, e)
    }, a.prototype.then = function (e, t) {
        var n = new this.constructor(r);
        return s(this, new d(e, t, n)), n
    }, a.prototype.finally = e, a.all = function (e) {
        return new a(function (t, n) {
            if (!o(e)) return n(new TypeError("Promise.all accepts an array"));
            var i = Array.prototype.slice.call(e);
            if (0 === i.length) return t([]);
            var r = i.length;

            function a(e, o) {
                try {
                    if (o && ("object" == typeof o || "function" == typeof o)) {
                        var s = o.then;
                        if ("function" == typeof s) return void s.call(o, function (t) {
                            a(e, t)
                        }, n)
                    }
                    i[e] = o, 0 == --r && t(i)
                } catch (e) {
                    n(e)
                }
            }
            for (var s = 0; s < i.length; s++) a(s, i[s])
        })
    }, a.allSettled = t, a.resolve = function (e) {
        return e && "object" == typeof e && e.constructor === a ? e : new a(function (t) {
            t(e)
        })
    }, a.reject = function (e) {
        return new a(function (t, n) {
            n(e)
        })
    }, a.race = function (e) {
        return new a(function (t, n) {
            if (!o(e)) return n(new TypeError("Promise.race accepts an array"));
            for (var i = 0, r = e.length; i < r; i++) a.resolve(e[i]).then(t, n)
        })
    }, a._immediateFn = "function" == typeof i && function (e) {
        i(e)
    } || function (e) {
        n(e, 0)
    }, a._unhandledRejectionFn = function (e) {
        "undefined" != typeof console && console && console.warn("Possible Unhandled Promise Rejection:", e)
    };
    var p, f = function () {
        if ("undefined" != typeof self) return self;
        if ("undefined" != typeof window) return window;
        if ("undefined" != typeof global) return global;
        throw new Error("unable to locate global object")
    }();
    "function" != typeof f.Promise ? f.Promise = a : (f.Promise.prototype.finally || (f.Promise.prototype.finally = e), f.Promise.allSettled || (f.Promise.allSettled = t)), Array.prototype.indexOf || (Array.prototype.indexOf = function (e) {
        return function (t, n) {
            if (null == this) throw TypeError("Array.prototype.indexOf called on null or undefined");
            var i = e(this),
                o = i.length >>> 0,
                r = Math.min(0 | n, o);
            if (r < 0) r = Math.max(0, o + r);
            else if (r >= o) return -1;
            if (void 0 === t) {
                for (; r !== o; ++r)
                    if (void 0 === i[r] && r in i) return r
            } else if (t != t) {
                for (; r !== o; ++r)
                    if (i[r] != i[r]) return r
            } else
                for (; r !== o; ++r)
                    if (i[r] === t) return r;
            return -1
        }
    }(Object)), Array.isArray || (Array.isArray = function (e) {
        return "[object Array]" === Object.prototype.toString.call(e)
    }), document.getElementsByClassName || (window.Element.prototype.getElementsByClassName = document.constructor.prototype.getElementsByClassName = function (e) {
        if (document.querySelectorAll) return document.querySelectorAll("." + e);
        for (var t = document.getElementsByTagName("*"), n = new RegExp("(^|\\s)" + e + "(\\s|$)"), i = [], o = 0; o < t.length; o++) n.test(t[o].className) && i.push(t[o]);
        return i
    }), String.prototype.startsWith || (String.prototype.startsWith = function (e, t) {
        return this.substr(!t || t < 0 ? 0 : +t, e.length) === e
    }), String.prototype.endsWith || (String.prototype.endsWith = function (e, t) {
        return (void 0 === t || t > this.length) && (t = this.length), this.substring(t - e.length, t) === e
    });
    try {
        if (Object.defineProperty && Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(Element.prototype, "textContent") && !Object.getOwnPropertyDescriptor(Element.prototype, "textContent").get) {
            var m = Object.getOwnPropertyDescriptor(Element.prototype, "innerText");
            Object.defineProperty(Element.prototype, "textContent", {
                get: function () {
                    return m.get.call(this)
                },
                set: function (e) {
                    m.set.call(this, e)
                }
            })
        }
    } catch (e) {}
    Function.prototype.bind || (Function.prototype.bind = function (e) {
        if ("function" != typeof this) throw new TypeError("Function.prototype.bind: Item Can Not Be Bound.");
        var t = Array.prototype.slice.call(arguments, 1),
            n = this,
            i = function () {},
            o = function () {
                return n.apply(this instanceof i ? this : e, t.concat(Array.prototype.slice.call(arguments)))
            };
        return this.prototype && (i.prototype = this.prototype), o.prototype = new i, o
    }), "function" != typeof Object.create && (Object.create = function (e, t) {
        function n() {}
        if (n.prototype = e, "object" == typeof t)
            for (var i in t) t.hasOwnProperty(i) && (n[i] = t[i]);
        return new n
    }), Date.now || (Date.now = function () {
        return (new Date).getTime()
    }), window.console || (window.console = {});
    for (var g, y, v, w, b, _, x = ["error", "info", "log", "show", "table", "trace", "warn"], C = function (e) {}, k = x.length; --k > -1;) p = x[k], window.console[p] || (window.console[p] = C);
    if (window.atob) try {
        window.atob(" ")
    } catch (e) {
        window.atob = (g = window.atob, (y = function (e) {
            return g(String(e).replace(/[\t\n\f\r ]+/g, ""))
        }).original = g, y)
    } else {
        var E = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            O = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
        window.atob = function (e) {
            if (e = String(e).replace(/[\t\n\f\r ]+/g, ""), !O.test(e)) throw new TypeError("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
            var t, n, i;
            e += "==".slice(2 - (3 & e.length));
            for (var o = "", r = 0; r < e.length;) t = E.indexOf(e.charAt(r++)) << 18 | E.indexOf(e.charAt(r++)) << 12 | (n = E.indexOf(e.charAt(r++))) << 6 | (i = E.indexOf(e.charAt(r++))), o += 64 === n ? String.fromCharCode(t >> 16 & 255) : 64 === i ? String.fromCharCode(t >> 16 & 255, t >> 8 & 255) : String.fromCharCode(t >> 16 & 255, t >> 8 & 255, 255 & t);
            return o
        }
    }
    if (Event.prototype.preventDefault || (Event.prototype.preventDefault = function () {
            this.returnValue = !1
        }), Event.prototype.stopPropagation || (Event.prototype.stopPropagation = function () {
            this.cancelBubble = !0
        }), window.Prototype && Array.prototype.toJSON) {
        console.error("[hCaptcha] Custom JSON polyfill detected, please remove to ensure hCaptcha works properly");
        var S = Array.prototype.toJSON,
            P = JSON.stringify;
        JSON.stringify = function (e) {
            try {
                return delete Array.prototype.toJSON, P(e)
            } finally {
                Array.prototype.toJSON = S
            }
        }
    }
    Object.keys || (Object.keys = (v = Object.prototype.hasOwnProperty, w = !Object.prototype.propertyIsEnumerable.call({
        toString: null
    }, "toString"), _ = (b = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"]).length, function (e) {
        if ("function" != typeof e && ("object" != typeof e || null === e)) throw new TypeError("Object.keys called on non-object");
        var t, n, i = [];
        for (t in e) v.call(e, t) && i.push(t);
        if (w)
            for (n = 0; n < _; n++) v.call(e, b[n]) && i.push(b[n]);
        return i
    }));
    var I = "challenge-escaped",
        B = "challenge-closed",
        T = "challenge-expired",
        j = "bundle-error",
        M = "network-error",
        A = "challenge-error",
        $ = "missing-captcha",
        L = "missing-sitekey",
        D = "invalid-captcha-id";

    function R(e, t) {
        this.cause = e, this.message = t
    }

    function N(e) {
        R.call(this, D, "Invalid hCaptcha id: " + e)
    }

    function z() {
        R.call(this, $, "No hCaptcha exists.")
    }

    function W() {
        R.call(this, L, "Missing sitekey - https://hcaptcha.com/docs/configuration#jsapi")
    }
    R.prototype = Error.prototype;
    var F = [],
        U = [],
        J = {
            add: function (e) {
                F.push(e)
            },
            remove: function (e) {
                for (var t = !1, n = F.length; --n > -1 && !1 === t;) F[n].id === e.id && (t = F[n], F.splice(n, 1));
                return t
            },
            each: function (e) {
                for (var t = -1; ++t < F.length;) e(F[t])
            },
            isValidId: function (e) {
                for (var t = !1, n = -1; ++n < F.length && !1 === t;) F[n].id === e && (t = !0);
                return t
            },
            getByIndex: function (e) {
                for (var t = !1, n = -1; ++n < F.length && !1 === t;) n === e && (t = F[n]);
                return t
            },
            getById: function (e) {
                for (var t = !1, n = -1; ++n < F.length && !1 === t;) F[n].id === e && (t = F[n]);
                return t
            },
            getCaptchaIdList: function () {
                var e = [];
                return J.each(function (t) {
                    e.push(t.id)
                }), e
            },
            pushSession: function (e, t) {
                U.push([e, t]), U.length > 10 && U.splice(0, U.length - 10)
            },
            getSession: function () {
                return U
            }
        },
        q = [{
            family: "UC Browser",
            patterns: ["(UC? ?Browser|UCWEB|U3)[ /]?(\\d+)\\.(\\d+)\\.(\\d+)"]
        }, {
            family: "Opera",
            name_replace: "Opera Mobile",
            patterns: ["(Opera)/.+Opera Mobi.+Version/(\\d+)\\.(\\d+)", "(Opera)/(\\d+)\\.(\\d+).+Opera Mobi", "Opera Mobi.+(Opera)(?:/|\\s+)(\\d+)\\.(\\d+)", "Opera Mobi", "(?:Mobile Safari).*(OPR)/(\\d+)\\.(\\d+)\\.(\\d+)"]
        }, {
            family: "Opera",
            name_replace: "Opera Mini",
            patterns: ["(Opera Mini)(?:/att|)/?(\\d+|)(?:\\.(\\d+)|)(?:\\.(\\d+)|)", "(OPiOS)/(\\d+).(\\d+).(\\d+)"]
        }, {
            family: "Opera",
            name_replace: "Opera Neon",
            patterns: ["Chrome/.+( MMS)/(\\d+).(\\d+).(\\d+)"]
        }, {
            name_replace: "Opera",
            patterns: ["(Opera)/9.80.*Version/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)", "(?:Chrome).*(OPR)/(\\d+)\\.(\\d+)\\.(\\d+)"]
        }, {
            family: "Firefox",
            name_replace: "Firefox Mobile",
            patterns: ["(Fennec)/(\\d+)\\.(\\d+)\\.?([ab]?\\d+[a-z]*)", "(Fennec)/(\\d+)\\.(\\d+)(pre)", "(Fennec)/(\\d+)\\.(\\d+)", "(?:Mobile|Tablet);.*(Firefox)/(\\d+)\\.(\\d+)", "(FxiOS)/(\\d+)\\.(\\d+)(\\.(\\d+)|)(\\.(\\d+)|)"]
        }, {
            name_replace: "Coc Coc",
            patterns: ["(coc_coc_browser)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)"]
        }, {
            family: "QQ",
            name_replace: "QQ Mini",
            patterns: ["(MQQBrowser/Mini)(?:(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)|)"]
        }, {
            family: "QQ",
            name_replace: "QQ Mobile",
            patterns: ["(MQQBrowser)(?:/(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)|)"]
        }, {
            name_replace: "QQ",
            patterns: ["(QQBrowser)(?:/(\\d+)(?:\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)|)"]
        }, {
            family: "Edge",
            name: "Edge Mobile",
            patterns: ["Windows Phone .*(Edge)/(\\d+)\\.(\\d+)", "(EdgiOS|EdgA)/(\\d+)\\.(\\d+).(\\d+).(\\d+)"]
        }, {
            name_replace: "Edge",
            patterns: ["(Edge|Edg)/(\\d+)(?:\\.(\\d+)|)"]
        }, {
            patterns: ["(Puffin)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)"]
        }, {
            family: "Chrome",
            name_replace: "Chrome Mobile",
            patterns: ["Version/.+(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)", "; wv\\).+(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)", "(CriOS)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)", "(CrMo)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)", "(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+) Mobile(?:[ /]|$)", " Mobile .*(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)"]
        }, {
            family: "Yandex",
            name_replace: "Yandex Mobile",
            patterns: ["(YaBrowser)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+).*Mobile"]
        }, {
            name_replace: "Yandex",
            patterns: ["(YaBrowser)/(\\d+)\\.(\\d+)\\.(\\d+)"]
        }, {
            patterns: ["(Vivaldi)/(\\d+)\\.(\\d+)", "(Vivaldi)/(\\d+)\\.(\\d+)\\.(\\d+)"]
        }, {
            name_replace: "Brave",
            patterns: ["(brave)/(\\d+)\\.(\\d+)\\.(\\d+) Chrome"]
        }, {
            family: "Chrome",
            patterns: ["(Chromium|Chrome)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)"]
        }, {
            name_replace: "Internet Explorer Mobile",
            patterns: ["(IEMobile)[ /](\\d+)\\.(\\d+)"]
        }, {
            family: "Safari",
            name_replace: "Safari Mobile",
            patterns: ["(iPod|iPhone|iPad).+Version/(d+).(d+)(?:.(d+)|).*[ +]Safari", "(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).* AppleNews\\/\\d+\\.\\d+\\.\\d+?", "(iPod|iPhone|iPad).+Version/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)", "(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).*Mobile.*[ +]Safari", "(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).*Mobile", "(iPod|iPod touch|iPhone|iPad).* Safari", "(iPod|iPod touch|iPhone|iPad)"]
        }, {
            name_replace: "Safari",
            patterns: ["(Version)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|).*Safari/"]
        }, {
            name_replace: "Internet Explorer",
            patterns: ["(Trident)/(7|8).(0)"],
            major_replace: "11"
        }, {
            name_replace: "Internet Explorer",
            patterns: ["(Trident)/(6)\\.(0)"],
            major_replace: "10"
        }, {
            name_replace: "Internet Explorer",
            patterns: ["(Trident)/(5)\\.(0)"],
            major_replace: "9"
        }, {
            name_replace: "Internet Explorer",
            patterns: ["(Trident)/(4)\\.(0)"],
            major_replace: "8"
        }, {
            family: "Firefox",
            patterns: ["(Firefox)/(\\d+)\\.(\\d+)\\.(\\d+)", "(Firefox)/(\\d+)\\.(\\d+)(pre|[ab]\\d+[a-z]*|)"]
        }],
        H = [{
            family: "Windows",
            name_replace: "Windows Phone",
            patterns: ["(Windows Phone) (?:OS[ /])?(\\d+)\\.(\\d+)", "^UCWEB.*; (wds) (\\d+)\\.(d+)(?:\\.(\\d+)|);", "^UCWEB.*; (wds) (\\d+)\\.(\\d+)(?:\\.(\\d+)|);"]
        }, {
            family: "Windows",
            name_replace: "Windows Mobile",
            patterns: ["(Windows ?Mobile)"]
        }, {
            name_replace: "Android",
            patterns: ["(Android)[ \\-/](\\d+)(?:\\.(\\d+)|)(?:[.\\-]([a-z0-9]+)|)", "(Android) (d+);", "^UCWEB.*; (Adr) (\\d+)\\.(\\d+)(?:[.\\-]([a-z0-9]+)|);", "^(JUC).*; ?U; ?(?:Android|)(\\d+)\\.(\\d+)(?:[\\.\\-]([a-z0-9]+)|)", "(android)\\s(?:mobile\\/)(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)|)|)", "(Silk-Accelerated=[a-z]{4,5})", "Puffin/[\\d\\.]+AT", "Puffin/[\\d\\.]+AP"]
        }, {
            name_replace: "Chrome OS",
            patterns: ["(x86_64|aarch64)\\ (\\d+)\\.(\\d+)\\.(\\d+).*Chrome.*(?:CitrixChromeApp)$", "(CrOS) [a-z0-9_]+ (\\d+)\\.(\\d+)(?:\\.(\\d+)|)"]
        }, {
            name_replace: "Windows",
            patterns: ["(Windows 10)", "(Windows NT 6\\.4)", "(Windows NT 10\\.0)"],
            major_replace: "10"
        }, {
            name_replace: "Windows",
            patterns: ["(Windows NT 6\\.3; ARM;)", "(Windows NT 6.3)"],
            major_replace: "8",
            minor_replace: "1"
        }, {
            name_replace: "Windows",
            patterns: ["(Windows NT 6\\.2)"],
            major_replace: "8"
        }, {
            name_replace: "Windows",
            patterns: ["(Windows NT 6\\.1)"],
            major_replace: "7"
        }, {
            name_replace: "Windows",
            patterns: ["(Windows NT 6\\.0)"],
            major_replace: "Vista"
        }, {
            name_replace: "Windows",
            patterns: ["(Windows (?:NT 5\\.2|NT 5\\.1))"],
            major_replace: "XP"
        }, {
            name_replace: "Mac OS X",
            patterns: ["((?:Mac[ +]?|; )OS[ +]X)[\\s+/](?:(\\d+)[_.](\\d+)(?:[_.](\\d+)|)|Mach-O)", "\\w+\\s+Mac OS X\\s+\\w+\\s+(\\d+).(\\d+).(\\d+).*", "(?:PPC|Intel) (Mac OS X)"]
        }, {
            name_replace: "Mac OS X",
            patterns: [" (Dar)(win)/(10).(d+).*((?:i386|x86_64))"],
            major_replace: "10",
            minor_replace: "6"
        }, {
            name_replace: "Mac OS X",
            patterns: [" (Dar)(win)/(11).(\\d+).*\\((?:i386|x86_64)\\)"],
            major_replace: "10",
            minor_replace: "7"
        }, {
            name_replace: "Mac OS X",
            patterns: [" (Dar)(win)/(12).(\\d+).*\\((?:i386|x86_64)\\)"],
            major_replace: "10",
            minor_replace: "8"
        }, {
            name_replace: "Mac OS X",
            patterns: [" (Dar)(win)/(13).(\\d+).*\\((?:i386|x86_64)\\)"],
            major_replace: "10",
            minor_replace: "9"
        }, {
            name_replace: "iOS",
            patterns: ["^UCWEB.*; (iPad|iPh|iPd) OS (\\d+)_(\\d+)(?:_(\\d+)|);", "(CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS)[ +]+(\\d+)[_\\.](\\d+)(?:[_\\.](\\d+)|)", "(iPhone|iPad|iPod); Opera", "(iPhone|iPad|iPod).*Mac OS X.*Version/(\\d+)\\.(\\d+)", "\\b(iOS[ /]|iOS; |iPhone(?:/| v|[ _]OS[/,]|; | OS : |\\d,\\d/|\\d,\\d; )|iPad/)(\\d{1,2})[_\\.](\\d{1,2})(?:[_\\.](\\d+)|)", "\\((iOS);", "(iPod|iPhone|iPad)", "Puffin/[\\d\\.]+IT", "Puffin/[\\d\\.]+IP"]
        }, {
            family: "Chrome",
            name_replace: "Chromecast",
            patterns: ["(CrKey -)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)", "(CrKey[ +]armv7l)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)", "(CrKey)(?:[/](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)"]
        }, {
            name_replace: "Debian",
            patterns: ["([Dd]ebian)"]
        }, {
            family: "Linux",
            name_replace: "Linux",
            patterns: ["(Linux Mint)(?:/(\\d+)|)"]
        }, {
            family: "Linux",
            patterns: ["(Ubuntu|Kubuntu|Arch Linux|CentOS|Slackware|Gentoo|openSUSE|SUSE|Red Hat|Fedora|PCLinuxOS|Mageia|(?:Free|Open|Net|\\b)BSD)", "(Mandriva)(?: Linux|)/(?:[\\d.-]+m[a-z]{2}(\\d+).(\\d)|)", "(Linux)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)", "\\(linux-gnu\\)"]
        }, {
            family: "BlackBerry",
            name_replace: "BlackBerry OS",
            patterns: ["(BB10);.+Version/(\\d+)\\.(\\d+)\\.(\\d+)", "(Black[Bb]erry)[0-9a-z]+/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)", "(Black[Bb]erry).+Version/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)", "(Black[Bb]erry)"]
        }, {
            patterns: ["(Fedora|Red Hat|PCLinuxOS|Puppy|Ubuntu|Kindle|Bada|Sailfish|Lubuntu|BackTrack|Slackware|(?:Free|Open|Net|\\b)BSD)[/ ](\\d+)\\.(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)"]
        }],
        X = navigator.userAgent,
        Y = function () {
            return X
        },
        V = function (e) {
            return G(e || X, q)
        };

    function Q(e, t) {
        try {
            var n = new RegExp(t).exec(e);
            return n ? {
                name: n[1] || "Other",
                major: n[2] || "0",
                minor: n[3] || "0",
                patch: n[4] || "0"
            } : null
        } catch (e) {
            return null
        }
    }

    function G(e, t) {
        for (var n = null, i = null, o = -1, r = !1; ++o < t.length && !r;) {
            n = t[o];
            for (var a = -1; ++a < n.patterns.length && !r;) r = null !== (i = Q(e, n.patterns[a]))
        }
        return r ? (i.family = n.family || n.name_replace || i.name, n.name_replace && (i.name = n.name_replace), n.major_replace && (i.major = n.major_replace), n.minor_replace && (i.minor = n.minor_replace), n.patch_replace && (i.minor = n.patch_replace), i) : {
            family: "Other",
            name: "Other",
            major: "0",
            minor: "0",
            patch: "0"
        }
    }

    function K() {
        var e = this,
            t = V(),
            n = Y();
        this.agent = n.toLowerCase(), this.language = window.navigator.userLanguage || window.navigator.language, this.isCSS1 = "CSS1Compat" === (document.compatMode || ""), this.width = function () {
            return window.innerWidth && window.document.documentElement.clientWidth ? Math.min(window.innerWidth, document.documentElement.clientWidth) : window.innerWidth || window.document.documentElement.clientWidth || document.body.clientWidth
        }, this.height = function () {
            return window.innerHeight || window.document.documentElement.clientHeight || document.body.clientHeight
        }, this.scrollX = function () {
            return void 0 !== window.pageXOffset ? window.pageXOffset : e.isCSS1 ? document.documentElement.scrollLeft : document.body.scrollLeft
        }, this.scrollY = function () {
            return void 0 !== window.pageYOffset ? window.pageYOffset : e.isCSS1 ? document.documentElement.scrollTop : document.body.scrollTop
        }, this.type = "Edge" === t.family ? "edge" : "Internet Explorer" === t.family ? "ie" : "Chrome" === t.family ? "chrome" : "Safari" === t.family ? "safari" : "Firefox" === t.family ? "firefox" : t.family.toLowerCase(), this.version = 1 * (t.major + "." + t.minor) || 0, this.hasPostMessage = !!window.postMessage
    }
    K.prototype.hasEvent = function (e, t) {
        return "on" + e in (t || document.createElement("div"))
    }, K.prototype.getScreenDimensions = function () {
        var e = {};
        for (var t in window.screen) e[t] = window.screen[t];
        return delete e.orientation, e
    }, K.prototype.interrogateNavigator = function () {
        var e = {};
        for (var t in window.navigator) try {
            e[t] = window.navigator[t]
        } catch (e) {}
        if (delete e.plugins, delete e.mimeTypes, e.plugins = [], window.navigator.plugins)
            for (var n = 0; n < window.navigator.plugins.length; n++) e.plugins[n] = window.navigator.plugins[n].filename;
        return e
    }, K.prototype.supportsCanvas = function () {
        var e = document.createElement("canvas");
        return !(!e.getContext || !e.getContext("2d"))
    }, K.prototype.supportsWebAssembly = function () {
        try {
            if ("object" == typeof WebAssembly && "function" == typeof WebAssembly.instantiate) {
                var e = new WebAssembly.Module(Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0));
                if (e instanceof WebAssembly.Module) return new WebAssembly.Instance(e) instanceof WebAssembly.Instance
            }
        } catch (e) {
            return !1
        }
    };
    var Z = {
            Browser: new K,
            System: new function () {
                var e, t, n = function (e) {
                        return G(e || X, H)
                    }(),
                    i = Y();
                this.mobile = (e = !!("ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0), t = !1, n && (t = ["iOS", "Windows Phone", "Windows Mobile", "Android", "BlackBerry OS"].indexOf(n.name) >= 0), e && t), this.dpr = function () {
                    return window.devicePixelRatio || 1
                }, this.mobile && n && "Windows" === n.family && i.indexOf("touch") < 0 && (this.mobile = !1), this.os = "iOS" === n.family ? "ios" : "Android" === n.family ? "android" : "Mac OS X" === n.family ? "mac" : "Windows" === n.family ? "windows" : "Linux" === n.family ? "linux" : n.family.toLowerCase(), this.version = function () {
                    if (!n) return "unknown";
                    var e = n.major;
                    return n.minor && (e += "." + n.minor), n.patch && (e += "." + n.patch), e
                }()
            }
        },
        ee = {
            host: null,
            file: null,
            sitekey: null,
            a11y_tfe: null,
            pingdom: "safari" === Z.Browser.type && "windows" !== Z.System.os && "mac" !== Z.System.os && "ios" !== Z.System.os && "android" !== Z.System.os,
            assetDomain: "https://newassets.hcaptcha.com",
            assetUrl: "https://newassets.hcaptcha.com/captcha/v1/4ad5c92/static",
            width: null,
            height: null,
            mobile: null
        },
        te = {
            se: null,
            custom: !1,
            tplinks: "on",
            language: null,
            reportapi: "https://accounts.hcaptcha.com",
            endpoint: "https://hcaptcha.com",
            endpointOverride: null,
            size: "normal",
            theme: "light",
            assethost: null,
            imghost: null,
            recaptchacompat: "true"
        };

    function ne(e, t) {
        e.style.width = "304px", e.style.height = "78px", e.style.backgroundColor = "#f9e5e5", e.style.position = "relative", e.innerHTML = "";
        var n = document.createElement("div");
        n.style.width = "284px", n.style.position = "absolute", n.style.top = "12px", n.style.left = "10px", n.style.color = "#7c0a06", n.style.fontSize = "14px", n.style.fontWeight = "normal", n.style.lineHeight = "18px", n.innerHTML = t || "Please <a style='color:inherit;text-decoration:underline; font: inherit' target='_blank' href='https://www.whatismybrowser.com/guides/how-to-update-your-browser/auto'>upgrade your browser</a> to complete this captcha.", e.appendChild(n)
    }
    var ie = !0;

    function oe(e) {
        var t = {
            message: e.name + ": " + e.message
        };
        e.stack && (t.stack_trace = {
            trace: e.stack
        }), ae("report error", "internal", "debug", t), re("internal error", "error", ee.file)
    }

    function re(e, t, n) {
        ie && window.Raven && Raven.captureMessage(e, {
            level: t,
            logger: n
        })
    }

    function ae(e, t, n, i) {
        ie && window.Raven && Raven.captureBreadcrumb({
            message: e,
            category: t,
            level: n,
            data: i
        })
    }

    function se() {
        try {
            (function (e) {
                var t = [].slice.call(arguments, 1);
                "string" == typeof e ? window[e] ? "function" == typeof window[e] ? window[e].apply(null, t) : console.log("[hCaptcha] Callback '" + e + "' is not a function.") : console.log("[hCaptcha] Callback '" + e + "' is not defined.") : "function" == typeof e ? e.apply(null, t) : console.log("[hcaptcha] Invalid callback '" + e + "'.")
            }).apply(null, arguments)
        } catch (e) {
            console.error("[hCaptcha] There was an error in your callback."), console.error(e)
        }
    }
    var ce = {
            eventName: function (e) {
                var t = e;
                return "down" === e || "up" === e || "move" === e || "over" === e || "out" === e ? t = !Z.System.mobile || "down" !== e && "up" !== e && "move" !== e ? "mouse" + e : "down" === e ? "touchstart" : "up" === e ? "touchend" : "touchmove" : "enter" === e && (t = "keydown"), t
            },
            actionName: function (e) {
                var t = e;
                return "touchstart" === t || "mousedown" === t ? t = "down" : "touchmove" === t || "mousemove" === t ? t = "move" : "touchend" === t || "mouseup" === t ? t = "up" : "mouseover" === t ? t = "over" : "mouseout" === t && (t = "out"), t
            },
            eventCallback: function (e, t, n) {
                var i = ce.actionName(e);
                return function (o) {
                    if (o = o || window.event, "down" === i || "move" === i || "up" === i || "over" === i || "out" === i || "click" === i) {
                        var r = ce.eventCoords(o),
                            a = n.getBoundingClientRect();
                        o.windowX = r.x, o.windowY = r.y, o.elementX = o.windowX - (a.x || a.left), o.elementY = o.windowY - (a.y || a.top)
                    }
                    o.keyNum = o.which || o.keyCode || 0, "enter" === e && 13 !== o.keyNum && 32 !== o.keyNum || (o.action = i, o.targetElement = n, t(o))
                }
            },
            eventCoords: function (e) {
                var t = {
                    x: 0,
                    y: 0
                };
                if (e.windowsPointer) return e;
                if (!e) return t;
                if (e.touches || e.changedTouches) {
                    var n = (e.touches && e.touches.length >= 1 ? e.touches : e.changedTouches)[0];
                    t.x = n.pageX || n.clientX, t.y = n.pageY || n.clientY
                } else t.x = e.pageX || e.clientX, t.y = e.pageY || e.clientY;
                return t
            }
        },
        he = ["Webkit", "Moz", "ms"],
        le = document.createElement("div").style,
        de = {};

    function ue(e) {
        return de[e] || (e in le ? e : de[e] = function (e) {
            for (var t = e[0].toUpperCase() + e.slice(1), n = he.length; n--;)
                if ((e = he[n] + t) in le) return e
        }(e) || e)
    }

    function pe(e, t, n) {
        if (this.dom = null, this._clss = [], this._nodes = [], this._listeners = [], this._frag = null, e && "object" == typeof e) {
            this.dom = e;
            var i = [],
                o = [];
            "string" == typeof e.className && (o = e.className.split(" "));
            for (var r = 0; r < o.length; r++) "" !== o[r] && " " !== o[r] && i.push(o[r]);
            this._clss = i
        } else null != n || (n = !0), (!e || "string" == typeof e && (e.indexOf("#") >= 0 || e.indexOf(".") >= 0)) && (e && (t = e), e = "div"), this.dom = document.createElement(e), t && (t.indexOf("#") >= 0 ? this.dom.id = t.split("#")[1] : (t.indexOf(".") >= 0 && (t = t.split(".")[1]), this.addClass.call(this, t)));
        !0 === n && (this._frag = document.createDocumentFragment(), this._frag.appendChild(this.dom))
    }

    function fe(e) {
        if (null === e) return "";
        var t = [];
        return function e(t, n) {
            var i, o;
            if ("object" == typeof t)
                for (o in t) !0 === me(i = t[o]) ? e(i, n) : n[n.length] = ge(o, i);
            else if (!0 === Array.isArray(t))
                for (var r = 0; r < t.length; r++) !0 === me(i = t[r]) ? e(t, n) : n[n.length] = ge(o, i);
            else n[n.length] = ge(t)
        }(e, t), t.join("&")
    }

    function me(e) {
        return !0 === Array.isArray(e) || "object" == typeof e
    }

    function ge(e, t) {
        return encodeURIComponent(e) + "=" + encodeURIComponent(null === t ? "" : t)
    }
    pe.prototype.createElement = function (e, t) {
        var n = new pe(e, t, !1);
        return this.appendElement.call(this, n), this._nodes.push(n), n
    }, pe.prototype.appendElement = function (e) {
        if (void 0 === e) return oe({
            name: "DomElement Add Child",
            message: "Child Element is undefined"
        });
        var t;
        t = void 0 !== e._frag && null !== e._frag ? e._frag : void 0 !== e.dom ? e.dom : e;
        try {
            e instanceof pe && (e._parent = this), this.dom.appendChild(t)
        } catch (e) {
            oe({
                name: "DomElement Add Child",
                message: "Failed to append child."
            })
        }
        return this
    }, pe.prototype.removeElement = function (e) {
        try {
            var t;
            if (e._nodes)
                for (t = e._nodes.length; t--;) e.removeElement(e._nodes[t]);
            for (t = this._nodes.length; --t > -1;) this._nodes[t] === e && this._nodes.splice(t, 1);
            this.dom.removeChild(e.dom || e), e.__destroy && e.__destroy()
        } catch (e) {
            oe({
                name: "DomElement Remove Child",
                message: "Failed to remove child."
            })
        }
    }, pe.prototype.addClass = function (e) {
        return !1 === this.hasClass.call(this, e) && (this._clss.push(e), this.dom.className = this._clss.join(" ")), this
    }, pe.prototype.hasClass = function (e) {
        for (var t = -1 !== this.dom.className.split(" ").indexOf(e), n = this._clss.length; n-- && !t;) t = this._clss[n] === e;
        return t
    }, pe.prototype.removeClass = function (e) {
        for (var t = this._clss.length; --t > -1;) this._clss[t] === e && this._clss.splice(t, 1);
        return this.dom.className = this._clss.join(" "), this
    }, pe.prototype.text = function (e) {
        if (this && this.dom) {
            if (!e) return this.dom.textContent;
            for (var t, n, i, o, r = /&(.*?);/g, a = /<[a-z][\s\S]*>/i; null !== (t = r.exec(e));) !1 === a.test(t[0]) ? (i = t[0], o = void 0, (o = document.createElement("div")).innerHTML = i, n = o.textContent, e = e.replace(new RegExp(t[0], "g"), n)) : e = e.replace(t[0], "");
            return this.dom.textContent = e, this
        }
    }, pe.prototype.content = pe.prototype.text, pe.prototype.css = function (e) {
        var t;
        for (var n in e) {
            t = e[n];
            try {
                if ("opacity" !== n && "zIndex" !== n && "fontWeight" !== n && isFinite(t) && parseFloat(t) === t && (t += "px"), "ie" === Z.Browser.type && 8 === Z.Browser.version && "opacity" === n) this.dom.style.filter = "alpha(opacity=" + 100 * t + ")";
                else {
                    var i = ue(n);
                    this.dom.style[i] = t
                }
            } catch (e) {}
        }
        return this
    }, pe.prototype.backgroundImage = function (e, t, n, i) {
        var o = void 0 !== t && void 0 !== n,
            r = {
                "-ms-high-contrast-adjust": "none"
            };
        if ("object" == typeof t && (i = t), void 0 === i && (i = {}), o) {
            var a = e.width / e.height,
                s = t,
                c = s / a;
            i.cover && c < n && (s = (c = n) * a), i.contain && c > n && (s = (c = n) * a), r.width = s, r.height = c, i.center && (r.marginLeft = -s / 2, r.marginTop = -c / 2, r.position = "absolute", r.left = "50%", r.top = "50%"), (i.left || i.right) && (r.left = i.left || 0, r.top = i.top || 0)
        }
        "ie" === Z.Browser.type && 8 === Z.Browser.version ? r.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + e.src + "',sizingMethod='scale')" : (r.background = "url(" + e.src + ")", r.backgroundPosition = "50% 50%", r.backgroundRepeat = "no-repeat", r.backgroundSize = o ? s + "px " + c + "px" : i.cover ? "cover" : i.contain ? "contain" : "100%"), this.css.call(this, r)
    }, pe.prototype.setAttribute = function (e, t) {
        var n;
        if ("object" == typeof e)
            for (var i in e) n = e[i], this.dom.setAttribute(i, n);
        else this.dom.setAttribute(e, t)
    }, pe.prototype.removeAttribute = function (e, t) {
        var n;
        if ("object" == typeof e)
            for (var i in e) n = e[i], this.dom.removeAttribute(i, n);
        else this.dom.removeAttribute(e, t)
    }, pe.prototype.addEventListener = function (e, t, n) {
        var i = {
            event: ce.eventName(e),
            handler: ce.eventCallback(e, t, this.dom),
            callback: t
        };
        this._listeners.push(i), this.dom.addEventListener ? this.dom.addEventListener(i.event, i.handler, n) : this.dom.attachEvent("on" + i.event, i.handler)
    }, pe.prototype.removeEventListener = function (e, t, n) {
        for (var i, o = this._listeners.length; --o > -1;)(i = this._listeners[o]).event === e && i.callback === t && (this._listeners.splice(o, 1), this.dom.removeEventListener ? this.dom.removeEventListener(i.event, i.handler, n) : this.dom.detachEvent("on" + i.event, i.handler))
    }, pe.prototype.focus = function () {
        this.dom.focus()
    }, pe.prototype.blur = function () {
        this.dom.blur()
    }, pe.prototype.html = function (e) {
        return e && (this.dom.innerHTML = e), this.dom.innerHTML
    }, pe.prototype.__destroy = function () {
        for (var e, t = this._listeners.length; --t > -1;) e = this._listeners[t], this._listeners.splice(t, 1), this.dom.removeEventListener ? this.dom.removeEventListener(e.event, e.handler) : this.dom.detachEvent("on" + e.event, e.handler);
        return this.dom = null, this._clss = [], this._nodes = [], this._listeners = [], this._frag = null, e = null, null
    };
    var ye = {
            af: "Afrikaans",
            sq: "Albanian",
            am: "Amharic",
            ar: "Arabic",
            hy: "Armenian",
            az: "Azerbaijani",
            eu: "Basque",
            be: "Belarusian",
            bn: "Bengali",
            bg: "Bulgarian",
            bs: "Bosnian",
            my: "Burmese",
            ca: "Catalan",
            ceb: "Cebuano",
            zh: "Chinese",
            "zh-CN": "Chinese Simplified",
            "zh-TW": "Chinese Traditional",
            co: "Corsican",
            hr: "Croatian",
            cs: "Czech",
            da: "Danish",
            nl: "Dutch",
            en: "English",
            eo: "Esperanto",
            et: "Estonian",
            fa: "Persian",
            fi: "Finnish",
            fr: "French",
            fy: "Frisian",
            gd: "Gaelic",
            gl: "Galacian",
            ka: "Georgian",
            de: "German",
            el: "Greek",
            gu: "Gujurati",
            ht: "Haitian",
            ha: "Hausa",
            haw: "Hawaiian",
            he: "Hebrew",
            hi: "Hindi",
            hmn: "Hmong",
            hu: "Hungarian",
            is: "Icelandic",
            ig: "Igbo",
            id: "Indonesian",
            ga: "Irish",
            it: "Italian",
            ja: "Japanese",
            jw: "Javanese",
            kn: "Kannada",
            kk: "Kazakh",
            km: "Khmer",
            rw: "Kinyarwanda",
            ky: "Kirghiz",
            ko: "Korean",
            ku: "Kurdish",
            lo: "Lao",
            la: "Latin",
            lv: "Latvian",
            lt: "Lithuanian",
            lb: "Luxembourgish",
            mk: "Macedonian",
            mg: "Malagasy",
            ms: "Malay",
            ml: "Malayalam",
            mt: "Maltese",
            mi: "Maori",
            mr: "Marathi",
            mn: "Mongolian",
            ne: "Nepali",
            no: "Norwegian",
            ny: "Nyanja",
            or: "Oriya",
            pl: "Polish",
            "pt-BR": "Portuguese (Brazil)",
            pt: "Portuguese (Portugal)",
            ps: "Pashto",
            pa: "Punjabi",
            ro: "Romanian",
            ru: "Russian",
            sm: "Samoan",
            sn: "Shona",
            sd: "Sindhi",
            si: "Singhalese",
            sr: "Serbian",
            sk: "Slovak",
            sl: "Slovenian",
            so: "Somani",
            st: "Southern Sotho",
            es: "Spanish",
            su: "Sundanese",
            sw: "Swahili",
            sv: "Swedish",
            tl: "Tagalog",
            tg: "Tajik",
            ta: "Tamil",
            tt: "Tatar",
            te: "Teluga",
            th: "Thai",
            tr: "Turkish",
            tk: "Turkmen",
            ug: "Uyghur",
            uk: "Ukrainian",
            ur: "Urdu",
            uz: "Uzbek",
            vi: "Vietnamese",
            cy: "Welsh",
            xh: "Xhosa",
            yi: "Yiddish",
            yo: "Yoruba",
            zu: "Zulu"
        },
        ve = {
            zh: {
                "I am human": "æˆ‘æ˜¯äºº"
            },
            ar: {
                "I am human": "Ø£Ù†Ø§ Ø§Ù„Ø¥Ù†Ø³Ø§Ù†"
            },
            af: {
                "I am human": "Ek is menslike"
            },
            am: {
                "I am human": "áŠ¥áŠ” áˆ°á‹ áŠáŠ"
            },
            hy: {
                "I am human": "ÔµÕ½ Õ´Õ¡Ö€Õ¤ Õ¥Õ´"
            },
            az: {
                "I am human": "MÉ™n insanam"
            },
            eu: {
                "I am human": "Gizakia naiz"
            },
            bn: {
                "I am human": "à¦†à¦®à¦¿ à¦®à¦¾à¦¨à¦¬ à¦¨à¦‡"
            },
            bg: {
                "I am human": "ÐÐ· ÑÑŠÐ¼ Ñ‡Ð¾Ð²ÐµÐº"
            },
            ca: {
                "I am human": "SÃ³c humÃ "
            },
            hr: {
                "I am human": "Ja sam Äovjek"
            },
            cs: {
                "I am human": "Jsem ÄlovÄ›k"
            },
            da: {
                "I am human": "Jeg er et menneske"
            },
            nl: {
                "I am human": "Ik ben een mens"
            },
            et: {
                "I am human": "Ma olen inimeste"
            },
            fi: {
                "I am human": "Olen ihminen"
            },
            fr: {
                "I am human": "Je suis humain"
            },
            gl: {
                "I am human": "Eu son humano"
            },
            ka: {
                "I am human": "áƒ›áƒ” áƒ•áƒáƒ  áƒáƒ“áƒáƒ›áƒ˜áƒáƒœáƒ˜"
            },
            de: {
                "I am human": "Ich bin ein Mensch"
            },
            el: {
                "I am human": "Î•Î¯Î¼Î±Î¹ Î¬Î½Î¸ÏÏ‰Ï€Î¿Ï‚"
            },
            gu: {
                "I am human": "àª¹à«àª‚ àª®àª¾àª¨àªµ àª›à«àª‚"
            },
            iw: {
                "I am human": ". ×× ×™ ×× ×•×©×™"
            },
            hi: {
                "I am human": "à¤®à¥ˆà¤‚ à¤®à¤¾à¤¨à¤µ à¤¹à¥‚à¤‚"
            },
            hu: {
                "I am human": "Nem vagyok robot"
            },
            is: {
                "I am human": "Ã‰g er manneskja"
            },
            id: {
                "I am human": "Aku manusia"
            },
            it: {
                "I am human": "Sono un essere umano"
            },
            ja: {
                "I am human": "ç§ã¯äººé–“ã§ã™"
            },
            kn: {
                "I am human": "à²¨à²¾à²¨à³ à²®à²¾à²¨à²µà²¨à³"
            },
            ko: {
                "I am human": "ì‚¬ëžŒìž…ë‹ˆë‹¤"
            },
            lo: {
                "I am human": "àº‚à»‰àº­àºà»€àº›àº±àº™àº¡àº°àº™àº¸àº”"
            },
            lv: {
                "I am human": "Es esmu cilvÄ“ks"
            },
            lt: {
                "I am human": "AÅ¡ esu Å¾mogaus"
            },
            ms: {
                "I am human": "Saya manusia"
            },
            ml: {
                "I am human": "à´žà´¾àµ» à´®à´¨àµà´·àµà´¯à´¨à´¾à´£àµ"
            },
            mr: {
                "I am human": "à¤®à¥€ à¤®à¤¾à¤¨à¤µà¥€ à¤†à¤¹à¥‡"
            },
            mn: {
                "I am human": "Ð‘Ð¸ Ð±Ð¾Ð» Ñ…Ò¯Ð½"
            },
            no: {
                "I am human": "Jeg er menneskelig"
            },
            fa: {
                "I am human": "Ù…Ù† Ø§Ù†Ø³Ø§Ù†ÛŒ Ù‡Ø³ØªÙ…"
            },
            pl: {
                "I am human": "Jestem czÅ‚owiekiem"
            },
            pt: {
                "I am human": "Sou humano"
            },
            ro: {
                "I am human": "Eu sunt om"
            },
            ru: {
                "I am human": "Ð¯ Ñ‡ÐµÐ»Ð¾Ð²ÐµÐº"
            },
            sr: {
                "I am human": "Ja sam ljudski"
            },
            si: {
                "I am human": "à¶¸à¶¸ à¶¸à·’à¶±à·’à·ƒà·Šà·ƒà·”"
            },
            sk: {
                "I am human": "Ja som Älovek"
            },
            sl: {
                "I am human": "Jaz sem ÄloveÅ¡ki"
            },
            es: {
                "I am human": "Soy humano"
            },
            sw: {
                "I am human": "Mimi ni binadamu"
            },
            sv: {
                "I am human": "Jag Ã¤r mÃ¤nniska"
            },
            ta: {
                "I am human": "à®¨à®¾à®©à¯ à®®à®©à®¿à®¤"
            },
            te: {
                "I am human": "à°¨à±‡à°¨à± à°®à°¨à°¿à°·à°¿à°¨à°¿"
            },
            th: {
                "I am human": "à¸œà¸¡à¸¡à¸™à¸¸à¸©à¸¢à¹Œ"
            },
            tr: {
                "I am human": "Ben bir insanÄ±m"
            },
            uk: {
                "I am human": "Ð¯ Ð»ÑŽÐ´Ð¸Ð½Ð¸"
            },
            ur: {
                "I am human": "Ù…ÛŒÚº Ø§Ù†Ø³Ø§Ù† ÛÙˆÚº"
            },
            vi: {
                "I am human": "TÃ´i lÃ  con ngÆ°á»i"
            },
            zu: {
                "I am human": "Ngingumuntu"
            }
        },
        we = null,
        be = {
            translate: function (e, t) {
                var n = be.getBestTrans(ve),
                    i = n && n[e];
                if (i = i || e, t)
                    for (var o = Object.keys(t), r = o.length; r--;) i = i.replace(new RegExp("{{" + o[r] + "}}", "g"), t[o[r]]);
                return i
            },
            getBestTrans: function (e) {
                var t = be.getLocale();
                return t in e ? e[t] : be.getShortLocale(t) in e ? e[be.getShortLocale(t)] : "en" in e ? e.en : null
            },
            getLocale: function () {
                var e = we || window.navigator.userLanguage || window.navigator.language,
                    t = be.getShortLocale(e);
                return "in" === t && (e = "id"), "iw" === t && (e = "he"), "nb" === t && (e = "no"), "ji" === t && (e = "yi"), "zh-CN" === e && (e = "zh"), "jv" === t && (e = "jw"), ye[e] ? e : ye[t] ? t : "en"
            },
            setLocale: function (e) {
                we = e
            },
            getShortLocale: function (e) {
                return e.indexOf("-") >= 0 ? e.substring(0, e.indexOf("-")) : e
            },
            isShortLocale: function (e) {
                return 2 === e.length || 3 === e.length
            },
            addTable: function (e, t) {
                if (t || (t = Object.create(null)), ve[e]) {
                    var n = ve[e];
                    for (var i in t) n[i] = t[i]
                } else ve[e] = t;
                return ve[e]
            },
            getTable: function (e) {
                return ve[e]
            },
            addTables: function (e) {
                for (var t in e) be.addTable(t, e[t]);
                return ve
            },
            getTables: function () {
                return ve
            }
        },
        _e = {
            400: "Rate limited or network error. Please retry.",
            429: "Your computer or network has sent too many requests.",
            500: "Cannot contact hCaptcha. Check your connection and try again."
        },
        xe = function (e) {
            try {
                return be.translate(_e[e])
            } catch (e) {
                return !1
            }
        },
        Ce = "undefined" != typeof XDomainRequest && !("withCredentials" in XMLHttpRequest.prototype);

    function ke(e, t, n) {
        n = n || {};
        var i = {
            url: t,
            method: e.toUpperCase(),
            responseType: n.responseType || "string",
            dataType: n.dataType || null,
            withCredentials: n.withCredentials || !1,
            headers: n.headers || null,
            data: n.data || null,
            timeout: n.timeout || null
        };
        return i.legacy = i.withCredentials && Ce, i.data && ("json" === i.dataType && "object" == typeof i.data && (i.data = JSON.stringify(i.data)), "query" === i.dataType && (i.data = fe(i.data))), n.retry ? function (e, t) {
            var n, i = "attempts" in (t = t || {}) ? t.attempts : 1,
                o = t.delay || 0,
                r = t.onFail;
            return n = function (t, n, a) {
                e().then(t, function (e) {
                    var t = i-- > 0;
                    r && (t = !1 !== r(e) && t), t ? setTimeout(a, o) : n(e)
                })
            }, new Promise(function (e, t) {
                n(e, t, function i() {
                    n(e, t, i)
                })
            })
        }(function () {
            return Ee(i)
        }, n.retry) : Ee(i)
    }

    function Ee(e) {
        var t = e.legacy ? new XDomainRequest : new XMLHttpRequest,
            n = "function" == typeof e.url ? e.url() : e.url;
        return new Promise(function (i, o) {
            var r, a = function (r) {
                return function () {
                    var a = t.response || t.responseText,
                        s = t.statusText || "",
                        c = t.status,
                        h = t.readyState;
                    if (4 === h || e.legacy) {
                        if ("json" === e.responseType && a) try {
                            a = JSON.parse(a)
                        } catch (e) {}
                        if ("error" === r || c >= 400 && c <= 511) return void o({
                            event: M,
                            endpoint: n,
                            response: a,
                            state: h,
                            status: c,
                            message: xe(c || 400) || s
                        });
                        i({
                            state: h,
                            status: c,
                            body: a,
                            message: s
                        })
                    }
                }
            };
            if (t.onload = a("complete"), t.onerror = t.ontimeout = a("error"), t.open(e.method, n), e.timeout && (t.timeout = e.timeout), !e.legacy && (t.withCredentials = e.withCredentials, e.headers))
                for (var s in e.headers) r = e.headers[s], t.setRequestHeader(s, r);
            setTimeout(function () {
                t.send(e.data)
            }, 0)
        })
    }
    var Oe = function (e, t) {
            if ("object" == typeof e && void 0 === t && (e = (t = e).url), null === e) throw new Error("Url missing");
            return ke("GET", e, t)
        },
        Se = function (e) {
            if (te.assethost && e.indexOf(ee.assetDomain) >= 0) return te.assethost + e.replace(ee.assetDomain, "");
            if (te.imghost && e.indexOf("imgs") >= 0) {
                var t = e.indexOf(".ai") >= 0 ? e.indexOf(".ai") + 3 : e.indexOf(".com") + 4;
                return te.imghost + e.substr(t, e.length)
            }
            return e
        },
        Pe = ["svg", "gif", "png"];

    function Ie(e, t) {
        t = t || {};
        var n, i = e;
        if (0 === i.indexOf("data:image"))
            for (var o = !1, r = Pe.length, a = -1; a++ < r && !o;)(o = i.indexOf(Pe[a]) >= 0) && (n = Pe[a]);
        else n = i.substr(i.lastIndexOf(".") + 1, i.length);
        !(document.createElementNS && document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect) && t.fallback && (t.fallback.indexOf(".") >= 0 ? n = (i = t.fallback).substr(i.lastIndexOf(".") + 1, i.length) : (i = e.substr(0, e.indexOf(n)) + t.fallback, n = t.fallback)), t.prefix && (i = t.prefix + "/" + i), this.attribs = {
            crossOrigin: t.crossOrigin || null
        }, this.id = i, this.src = Se(i), this.ext = n, this.width = 0, this.height = 0, this.aspect = 0, this.loaded = !1, this.error = !1, this.element = null, this.cb = {
            load: [],
            error: []
        }
    }

    function Be(e, t, n) {
        for (var i = e[t], o = i.length, r = null; --o > -1;) r = i[o], i.splice(o, 1), r(n);
        "error" === t ? e.load = [] : e.error = []
    }

    function Te(e, t) {
        var n = e;
        t || (t = {}), t.prefix && (n = t.prefix + "/" + e), this.attribs = {
            defer: t.defer || null,
            async: t.async || null,
            crossOrigin: t.crossOrigin || null
        }, this.id = n, this.src = Se(n), this.loaded = !1, this.error = !1, this.element = null, this.cb = {
            load: [],
            error: []
        }
    }

    function je(e, t, n) {
        for (var i = e[t], o = i.length, r = null; --o > -1;) r = i[o], i.splice(o, 1), r(n);
        "error" === t ? e.load = [] : e.error = []
    }

    function Me(e, t) {
        var n = e;
        t || (t = {}), t.prefix && (n = t.prefix + "/" + e), this.id = n, this.src = Se(n), this.loaded = !1, this.error = !1, this.cb = {
            load: [],
            error: []
        }, this.data = null
    }

    function Ae(e, t, n) {
        for (var i = e[t], o = i.length, r = null; --o > -1;) r = i[o], i.splice(o, 1), r(n);
        "error" === t ? e.load = [] : e.error = []
    }
    Ie.prototype.load = function () {
        return "svg" === this.ext ? this._loadSvg() : this._loadImg()
    }, Ie.prototype._loadSvg = function () {
        var e, t = this,
            n = this.src,
            i = this.id;
        if (0 === n.indexOf("data:image/svg+xml")) {
            var o = n.slice("data:image/svg+xml,".length);
            e = Promise.resolve(decodeURIComponent(o))
        } else e = Oe(n).then(function (e) {
            return e.body
        });
        return e.then(function (e) {
            var n = (new DOMParser).parseFromString(e, "image/svg+xml").documentElement,
                i = parseInt(n.getAttribute("width")),
                o = parseInt(n.getAttribute("height"));
            return t._imgLoaded(n, i, o), t
        }).catch(function (e) {
            t.error = !0;
            var n = (e && e.message ? e.message : "Loading Error") + ": " + i;
            throw Be(t.cb, "error", n), n
        })
    }, Ie.prototype._loadImg = function () {
        var e = this,
            t = this.attribs,
            n = this.src,
            i = this.id;
        return new Promise(function (o, r) {
            var a = new Image;
            t.crossOrigin && (a.crossOrigin = t.crossOrigin), a.onerror = function (t) {
                e.error = !0, a.onload = a.onerror = null;
                var n = (t && t.message ? t.message : "Loading Error") + ": " + i;
                Be(e.cb, "error", n), r(n)
            }, a.onload = function () {
                e.loaded || (e._imgLoaded(a, a.width, a.height), a.onload = a.onerror = null, o(e))
            }, a.src = n, a.complete && a.onload()
        })
    }, Ie.prototype._imgLoaded = function (e, t, n) {
        this.element = new pe(e), this.width = t, this.height = n, this.aspect = t / n, this.loaded = !0, Be(this.cb, "load", this)
    }, Ie.prototype.onload = function (e) {
        this.error || (this.loaded ? e(this) : this.cb.load.push(e))
    }, Ie.prototype.onerror = function (e) {
        this.loaded && !this.error || (this.error ? e(this) : this.cb.error.push(e))
    }, Te.prototype.load = function () {
        var e = this,
            t = this.attribs,
            n = this.src,
            i = this.id;
        return new Promise(function (o, r) {
            var a = document.createElement("script");
            e.element = a, a.onerror = function (t) {
                e.error = !0, a.onload = a.onreadystatechange = a.onerror = null;
                var n = (t.message || "Loading Error") + ": " + i;
                je(e.cb, "error", n), r(n)
            }, a.onload = a.onreadystatechange = function () {
                this.loaded || a.readyState && "loaded" !== a.readyState && "complete" !== a.readyState || (e.loaded = !0, a.onload = a.onreadystatechange = a.onerror = null, document.body.removeChild(a), je(e.cb, "load", e), o(e))
            }, a.type = "text/javascript", a.src = n, t.crossOrigin && (a.crossorigin = t.crossOrigin), t.async && (a.async = !0), t.defer && (a.defer = !0), document.body.appendChild(a), a.complete && a.onload()
        })
    }, Te.prototype.onload = function (e) {
        this.error || (this.loaded ? e(this) : this.cb.load.push(e))
    }, Te.prototype.onerror = function (e) {
        this.loaded && !this.error || (this.error ? e(this) : this.cb.error.push(e))
    }, Me.prototype.load = function () {
        var e = this,
            t = this.src,
            n = this.id;
        return new Promise(function (i, o) {
            var r = {};
            t.indexOf("json") >= 0 && (r.responseType = "json"), Oe(t, r).then(function (t) {
                e.loaded = !0, e.data = t.body, Ae(e.cb, "load", e), i(e)
            }).catch(function (t) {
                e.error = !0;
                var i = (t && t.message ? t.message : "Loading Error") + ": " + n;
                Ae(e.cb, "error", i), o(i)
            })
        })
    }, Me.prototype.onload = function (e) {
        this.error || (this.loaded ? e(this) : this.cb.load.push(e))
    }, Me.prototype.onerror = function (e) {
        this.loaded && !this.error || (this.error ? e(this) : this.cb.error.push(e))
    };
    var $e = [],
        Le = {
            add: function (e, t) {
                var n = function (e) {
                    return e.toLowerCase().match(/\.(?:jpg|gif|png|jpeg|svg)$/g) ? "image" : e.toLowerCase().match(/\.(?:js)$/g) ? "script" : "file"
                }(e);
                return Le[n] ? Le[n](e, t) : Promise.resolve(null)
            },
            batch: function (e, t) {
                for (var n = [], i = -1; ++i < e.length;) {
                    var o = e[i];
                    n.push(Le.add(o, t))
                }
                return Promise.all(n).finally(function () {
                    n = []
                })
            },
            image: function (e, t) {
                var n = new Ie(e, t);
                return $e.push(n), n.load()
            },
            script: function (e, t) {
                var n = new Te(e, t);
                return $e.push(n), n.load()
            },
            file: function (e, t) {
                var n = new Me(e, t);
                return $e.push(n), n.load()
            },
            retrieve: function (e) {
                return new Promise(function (t, n) {
                    for (var i = $e.length, o = !1, r = null; --i > -1 && !o;) o = (r = $e[i]).id === e || -1 !== r.id.indexOf("/" === e[0] ? "" : "/" + e);
                    if (!o) return t(null);
                    r.onload(t), r.onerror(n)
                })
            }
        },
        De = function (e, t) {
            var n = {},
                i = Array.prototype.slice.call(arguments, 2);
            for (var o in t.apply(e, i), e) n[o] = e[o]
        },
        Re = function (e, t) {
            e.prototype = Object.create(t.prototype), e.prototype.constructor = e
        };
    var Ne = function e(t, n, i) {
        if ("object" == typeof t && t[n] && t[n].length > 0)
            for (var o = t[n].length; --o > -1;) e(t[n][o], n, i);
        void 0 !== t && i(t)
    };

    function ze(e, t) {
        De(this, pe, t || "div", e), this.children = [], this._events = []
    }

    function We(e) {
        De(this, ze, e.id || "." + e.name), this.state = {
            loaded: !1,
            name: e.name + ".svg",
            prefix: e.prefix || "https://newassets.hcaptcha.com/captcha/v1/4ad5c92/static/images",
            fill: e.fill,
            width: e.width || 25,
            height: e.height || e.width || 25
        }, this.img = null, (e.autoLoad || void 0 === e.autoLoad) && this.load()
    }

    function Fe(e, t) {
        this._period = e, this._interval = t, this._date = [], this._data = [], this._prevTimestamp = 0, this._meanPeriod = 0, this._meanCounter = 0
    }
    Re(ze, pe), ze.prototype.initComponent = function (e, t, n) {
        var i = new e(t);
        return i._parent = this, this.children.push(i), i.dom && (void 0 !== n ? n.appendElement && n.appendElement(i) : this.appendElement(i)), i
    }, ze.prototype.destroy = function () {
        var e = this;
        try {
            Ne(this, "children", function (t) {
                if (e !== t)
                    for (var n = e.children.length; --n > -1;) e.children[n] === t && e.children.splice(n, 1);
                t._destroy && t._destroy(), t = null
            })
        } catch (e) {
            throw new Error("Trouble destroying nodes: " + e)
        }
        return null
    }, ze.prototype._destroy = function () {
        try {
            this.onDestroy && this.onDestroy(), this._parent.removeElement && this._parent.removeElement(this);
            for (var e = this._events.length; --e > -1;) this._events.splice(e, 1);
            this.children = null, this._destroy = null, this._events = null, this.destroy = null, this.emit = null, this.on = null, this.off = null, this.initComponent = null
        } catch (e) {
            oe({
                name: "DomComponent",
                message: "Failed to destroy."
            })
        }
    }, ze.prototype.on = function (e, t) {
        for (var n = this._events.length, i = !1; --n > -1 && !1 === i;) this._events[n].event === e && (i = this._events[n]);
        !1 === i && (i = {
            event: e,
            listeners: []
        }, this._events.push(i)), i.listeners.push(t)
    }, ze.prototype.off = function (e, t) {
        for (var n = this._events.length; --n > -1;)
            if (this._events[n].event === e) {
                for (var i = this._events[n].listeners.length; --i > -1;) this._events[n].listeners[i] === t && this._events[n].listeners.splice(i, 1);
                0 === this._events[n].listeners.length && this._events.splice(n, 1)
            }
    }, ze.prototype.emit = function (e) {
        for (var t = Array.prototype.slice.call(arguments, 1), n = this._events.length; --n > -1 && this._events;)
            if (this._events[n].event === e)
                for (var i = this._events[n].listeners.length; --i > -1;) this._events[n].listeners[i].apply(this, t)
    }, Re(We, ze), We.prototype.load = function () {
        if (!this.state.loaded) {
            this.state.loaded = !0;
            var e = this,
                t = e.state.name;
            return Le.image(t, {
                prefix: e.state.prefix,
                fallback: "png"
            }).then(function (t) {
                e.img = t.element, e.appendElement(e.img), e._style()
            }).catch(function () {
                ae("svg failed to load", "image", "info", {
                    svgName: t
                })
            })
        }
    }, We.prototype._style = function () {
        this.css({
            width: this.state.width,
            height: this.state.height
        }), this.img.css({
            width: this.state.width,
            height: this.state.height,
            display: "block"
        }), this.state.fill && this.fill(this.state.fill)
    }, We.prototype.fill = function (e) {
        for (var t = this.img.dom.children, n = 0; n < t.length; n++) t[n].style && (t[n].style.fill = e)
    }, Fe.prototype.getMeanPeriod = function () {
        return this._meanPeriod
    }, Fe.prototype.getData = function () {
        return this._cleanStaleData(), this._data
    }, Fe.prototype.getSize = function () {
        return this._cleanStaleData(), this._data.length
    }, Fe.prototype.getCapacity = function () {
        return 0 === this._period ? this._interval : Math.ceil(this._interval / this._period)
    }, Fe.prototype.push = function (e, t) {
        this._cleanStaleData();
        var n = 0 === this._date.length;
        if (e - (this._date[this._date.length - 1] || 0) >= this._period && (this._date.push(e), this._data.push(t)), !n) {
            var i = e - this._prevTimestamp;
            this._meanPeriod = (this._meanPeriod * this._meanCounter + i) / (this._meanCounter + 1), this._meanCounter++
        }
        this._prevTimestamp = e
    }, Fe.prototype._cleanStaleData = function () {
        for (var e = Date.now(), t = this._date.length - 1; t >= 0; t--)
            if (e - this._date[t] >= this._interval) {
                this._date.splice(0, t + 1), this._data.splice(0, t + 1);
                break
            }
    };
    var Ue = {
            touchstart: "ts",
            touchend: "te",
            touchmove: "tm",
            touchcancel: "tc"
        },
        Je = {
            mousedown: "md",
            mouseup: "mu",
            mousemove: "mm"
        },
        qe = {
            keydown: "kd",
            keyup: "ku"
        },
        He = {
            devicemotion: "dm"
        },
        Xe = function (e, t) {
            var n = Je[e],
                i = null;
            return function (e) {
                i = function (e) {
                    return [e.windowX, e.windowY, Date.now()]
                }(e), t(n, i)
            }
        },
        Ye = function (e, t) {
            var n = Ue[e],
                i = null;
            return function (e) {
                i = function (e) {
                    var t = [];
                    try {
                        var n, i;
                        if (e.touches && e.touches.length >= 1 ? n = e.touches : e.changedTouches && e.changedTouches.length >= 1 && (n = e.changedTouches), n) {
                            for (var o = 0; o < n.length; o++) i = ce.eventCoords(n[o]), t.push([n[o].identifier, i.x, i.y]);
                            t.push(Date.now())
                        }
                        return t
                    } catch (e) {
                        return t
                    }
                }(e), t(n, i)
            }
        },
        Ve = function (e, t) {
            var n = qe[e],
                i = null;
            return function (e) {
                i = function (e) {
                    return [e.keyNum, Date.now()]
                }(e), t(n, i)
            }
        };

    function Qe() {
        this._manifest = {}, this.state = {
            timeBuffers: {},
            loadTime: Date.now(),
            recording: !1,
            initRecord: !1,
            record: {
                mouse: !0,
                touch: !0,
                keys: !1,
                motion: !0
            }
        }, this._recordEvent = this._recordEvent.bind(this)
    }
    Qe.prototype.record = function (e, t, n, i) {
        if (this._manifest.st = Date.now(), this.state.record.mouse = void 0 === e ? this.state.record.mouse : e, this.state.record.touch = void 0 === n ? this.state.record.touch : n, this.state.record.keys = void 0 === t ? this.state.record.keys : t, this.state.record.motion = void 0 === i ? this.state.record.motion : i, !1 === this.state.initRecord) {
            var o = new pe(document.body);
            this.state.record.mouse && (o.addEventListener("mousedown", Xe("mousedown", this._recordEvent)), o.addEventListener("mousemove", Xe("mousemove", this._recordEvent)), o.addEventListener("mouseup", Xe("mouseup", this._recordEvent))), !0 === this.state.record.keys && (o.addEventListener("keyup", Ve("keyup", this._recordEvent)), o.addEventListener("keydown", Ve("keydown", this._recordEvent))), this.state.record.touch && !0 === Z.Browser.hasEvent("touchstart", document.body) && (o.addEventListener("touchstart", Ye("touchstart", this._recordEvent)), o.addEventListener("touchmove", Ye("touchmove", this._recordEvent)), o.addEventListener("touchend", Ye("touchend", this._recordEvent))), this.state.record.motion && !0 === Z.Browser.hasEvent("devicemotion", window) && o.addEventListener("devicemotion", function (e, t) {
                var n = He[e],
                    i = null,
                    o = [];
                return function (e) {
                    null !== (i = function (e, t) {
                        (void 0 === e.acceleration || e.acceleration && void 0 === e.acceleration.x) && (e.acceleration = {
                            x: 0,
                            y: 0,
                            z: 0
                        }), (void 0 === e.rotationRate || e.rotationRate && void 0 === e.rotationRate.alpha) && (e.rotationRate = {
                            alpha: 0,
                            beta: 0,
                            gamma: 0
                        });
                        var n = [e.acceleration.x, e.acceleration.y, e.acceleration.z, e.rotationRate.alpha, e.rotationRate.beta, e.rotationRate.gamma, Date.now()],
                            i = [];
                        if (0 === t.length) t = n, i = n;
                        else {
                            for (var o, r = 0, a = 0; a < 6; a++) o = t[a] - n[a], i.push(n[a]), r += Math.abs(o);
                            if (i.push(Date.now()), t = n, r <= 0) return null
                        }
                        return {
                            motion: i,
                            prevmotion: t
                        }
                    }(e, o)) && (o = i.prevmotion, i = i.motion, t(n, i))
                }
            }("devicemotion", this._recordEvent)), this.state.initRecord = !0
        }
        this.state.recording = !0
    }, Qe.prototype.stop = function () {
        this.state.recording = !1
    }, Qe.prototype.time = function () {
        return this.state.loadTime
    }, Qe.prototype.getData = function () {
        for (var e in this.state.timeBuffers) this._manifest[e] = this.state.timeBuffers[e].getData(), this._manifest[e + "-mp"] = this.state.timeBuffers[e].getMeanPeriod();
        return this._manifest
    }, Qe.prototype.setData = function (e, t) {
        this._manifest[e] = t
    }, Qe.prototype.resetData = function () {
        this._manifest = {}, this.state.timeBuffers = {}
    }, Qe.prototype.circBuffPush = function (e, t) {
        this._recordEvent(e, t)
    }, Qe.prototype._recordEvent = function (e, t) {
        if (!1 !== this.state.recording) try {
            var n = t[t.length - 1];
            this.state.timeBuffers[e] || (this.state.timeBuffers[e] = new Fe(16, 15e3)), this.state.timeBuffers[e].push(n, t)
        } catch (e) {
            re("Event recording error: " + JSON.stringify(e), "error", "motion")
        }
    };
    var Ge = new Qe,
        Ke = [],
        Ze = !1,
        et = !1;

    function tt() {
        "interactive" !== document.readyState && "loaded" !== document.readyState && "complete" !== document.readyState || nt()
    }

    function nt() {
        if (!1 === et) {
            for (var e = 0; e < Ke.length; e++) Ke[e].fn.apply(null, Ke[e].args);
            Ke = []
        }
        et = !0, document.removeEventListener ? (document.removeEventListener("DOMContentLoaded", nt), window.removeEventListener("load", nt)) : (document.detachEvent("onreadystatechange", tt), window.detachEvent("onload", nt))
    }
    new pe(document);
    var it = new pe(window);

    function ot(e, t) {
        "object" != typeof e || t || (t = e, e = null);
        var n, i, o, r = !0 === (t = t || {}).async,
            a = new Promise(function (e, t) {
                i = e, o = t
            });
        if (a.resolve = i, a.reject = o, n = e ? J.getById(e) : J.getByIndex(0)) Ge.setData("exec", !0), r && n.setPromise(a), n.onReady(n.initChallenge, t);
        else if (e) {
            if (!r) throw new N(e);
            a.reject(D)
        } else {
            if (!r) throw new z;
            a.reject($)
        }
        if (r) return a
    }

    function rt(e) {
        var t, n = "";
        t = e ? J.getById(e) : J.getByIndex(0);
        try {
            for (var i = J.getSession(), o = i.length, r = !1; --o > -1 && !r;)(r = i[o][1] === t.id) && (n = i[o][0])
        } catch (e) {
            n = ""
        }
        return n
    }

    function at(e, t) {
        var n = e instanceof HTMLIFrameElement;
        try {
            n ? e.parentNode && e.contentWindow.postMessage(JSON.stringify(t), "*") : e.postMessage(JSON.stringify(t), "*")
        } catch (e) {
            re(e.message, "error", "messaging")
        }
    }

    function st(e, t) {
        this.target = e, this.id = t, this.messages = [], this.incoming = [], this.waiting = []
    }

    function ct(e, t) {
        var n = this,
            i = {},
            o = new Promise(function (e, t) {
                i.resolve = e, i.reject = t
            }),
            r = {
                source: "hcaptcha",
                label: e,
                id: n.id,
                promise: null,
                lookup: t
            };
        return o.then(function (e) {
            r.promise = "resolve", null !== e && (r.contents = e), at(n.target, r)
        }).catch(function (e) {
            r.promise = "reject", null !== e && (r.error = e), at(n.target, r)
        }), i
    }
    st.prototype.setID = function (e) {
        this.id = e
    }, st.prototype.contact = function (e, t) {
        if (!this.id) throw new Error("Chat requires unique id to communicate between windows");
        var n = this,
            i = Date.now().toString(36),
            o = {
                source: "hcaptcha",
                label: e,
                id: this.id,
                promise: "create",
                lookup: i
            };
        if (t) {
            if ("object" != typeof t) throw new Error("Message must be an object.");
            o.contents = t
        }
        return new Promise(function (t, r) {
            n.waiting.push({
                label: e,
                reject: r,
                resolve: t,
                lookup: i
            }), at(n.target, o)
        })
    }, st.prototype.listen = function (e, t) {
        if (!this.id) throw new Error("Chat requires unique id to communicate between windows");
        for (var n = this.messages.length, i = !1; --n > -1 && !1 === i;) this.messages[n].label === e && (i = this.messages[n]);
        !1 === i && (i = {
            label: e,
            listeners: []
        }, this.messages.push(i)), i.listeners.push(t)
    }, st.prototype.answer = function (e, t) {
        if (!this.id) throw new Error("Chat requires unique id to communicate between windows");
        for (var n = this.incoming.length, i = !1; --n > -1 && !1 === i;) this.incoming[n].label === e && (i = this.incoming[n]);
        !1 === i && (i = {
            label: e,
            listeners: []
        }, this.incoming.push(i)), i.listeners.push(t)
    }, st.prototype.send = function (e, t) {
        if (!this.id) throw new Error("Chat requires unique id to communicate between windows");
        var n = {
            source: "hcaptcha",
            label: e,
            id: this.id
        };
        if (t) {
            if ("object" != typeof t) throw new Error("Message must be an object.");
            n.contents = t
        }
        at(this.target, n)
    }, st.prototype.check = function (e, t) {
        for (var n = [].concat.apply([], [this.messages, this.incoming, this.waiting]), i = [], o = -1; ++o < n.length;)
            if (n[o].label === e) {
                if (t && n[o].lookup && t !== n[o].lookup) continue;
                i.push(n[o])
            } return i
    }, st.prototype.respond = function (e) {
        for (var t, n, i = -1, o = 0, r = [].concat.apply([], [this.messages, this.incoming, this.waiting]); ++i < r.length;)
            if (r[i].label === e.label) {
                if (e.lookup && r[i].lookup && e.lookup !== r[i].lookup) continue;
                var a = [];
                if (t = r[i], e.error && a.push(e.error), e.contents && a.push(e.contents), e.promise && "create" !== e.promise) {
                    t[e.promise].apply(t[e.promise], a);
                    for (var s = this.waiting.length, c = !1; --s > -1 && !1 === c;) this.waiting[s].label === t.label && this.waiting[s].lookup === t.lookup && (c = !0, this.waiting.splice(s, 1));
                    continue
                }
                for (o = 0; o < t.listeners.length; o++) {
                    if (n = t.listeners[o], "create" === e.promise) {
                        var h = ct.call(this, t.label, e.lookup);
                        a.push(h)
                    }
                    n.apply(n, a)
                }
            } r = null
    }, st.prototype.destroy = function () {
        return this.messages = null, this.incoming = null, this.waiting = null, null
    };
    var ht = {
        chats: [],
        isSupported: function () {
            return !!window.postMessage
        },
        createChat: function (e, t) {
            var n = new st(e, t);
            return ht.chats.push(n), n
        },
        addChat: function (e) {
            ht.chats.push(e)
        },
        removeChat: function (e) {
            for (var t = !1, n = ht.chats.length; --n > -1 && !1 === t;) e.id === ht.chats[n].id && e.target === ht.chats[n].target && (t = ht.chats[n], ht.chats.splice(n, 1));
            return t
        },
        handle: function (e) {
            var t = e.data;
            if ("string" == typeof t) try {
                if (!(t.indexOf("hcaptcha") >= 0)) return;
                t = JSON.parse(t);
                for (var n, i = ht.chats, o = -1; ++o < i.length;)(n = i[o]).id === t.id && n.respond(t)
            } catch (t) {
                ae("postMessage handler error", "postMessage", "debug", {
                    event: e,
                    error: t
                })
            }
        }
    };
    window.addEventListener ? window.addEventListener("message", ht.handle) : window.attachEvent("onmessage", ht.handle);
    var lt = {
        getCookie: function (e) {
            var t = document.cookie.replace(/ /g, "").split(";");
            try {
                for (var n = "", i = t.length; i-- && !n;) t[i].indexOf(e) >= 0 && (n = t[i]);
                return n
            } catch (e) {
                return ""
            }
        },
        hasCookie: function (e) {
            return !!lt.getCookie(e)
        },
        supportsAPI: function () {
            try {
                return "hasStorageAccess" in document && "requestStorageAccess" in document
            } catch (e) {
                return !1
            }
        },
        hasAccess: function () {
            return new Promise(function (e) {
                document.hasStorageAccess().then(function () {
                    e(!0)
                }).catch(function () {
                    e(!1)
                })
            })
        },
        requestAccess: function () {
            try {
                return document.requestStorageAccess()
            } catch (e) {
                return Promise.resolve()
            }
        }
    };

    function dt() {
        try {
            return Object.keys(window).sort().join(",")
        } catch (e) {
            return null
        }
    }

    function ut(e, t) {
        try {
            return e in t
        } catch (e) {
            return !1
        }
    }

    function pt(e) {
        return !!e && "object" == typeof e
    }

    function ft(e) {
        return pt(e) ? mt({}, e) : e
    }

    function mt(e, t) {
        var n, i = {},
            o = Object.keys(e);
        for (n = 0; n < o.length; n++) i[o[n]] = ft(e[o[n]]);
        var r, a, s = Object.keys(t);
        for (n = 0; n < s.length; n++) {
            var c = s[n];
            if (!(!ut(r = c, a = e) || Object.hasOwnProperty.call(a, r) && Object.propertyIsEnumerable.call(a, r))) return;
            ut(c, e) && pt(e[c]) ? i[c] = mt(e[c], t[c]) : i[c] = ft(t[c])
        }
        return i
    }
    var gt = {
            white: "#ffffff",
            black: "#000000"
        },
        yt = {
            100: "#fafafa",
            200: "#f5f5f5",
            300: "#E0E0E0",
            400: "#D7D7D7",
            500: "#BFBFBF",
            600: "#919191",
            700: "#555555",
            800: "#333333",
            900: "#222222",
            1000: "#14191F"
        },
        vt = "#00838F",
        wt = {
            mode: "light",
            grey: yt,
            primary: {
                main: vt
            },
            warn: {
                light: "#EB5757",
                main: "#EB5757",
                dark: "#DE3F3F"
            },
            text: {
                heading: yt[700],
                body: yt[700]
            }
        },
        bt = {
            mode: "dark",
            grey: yt,
            primary: {
                main: vt
            },
            text: {
                heading: yt[200],
                body: yt[200]
            }
        };

    function _t(e, t) {
        return "dark" === t && e in bt ? bt[e] : wt[e]
    }

    function xt() {
        this._themes = Object.create(null), this._active = "light", this.add("light", {}), this.add("dark", {
            palette: {
                mode: "dark"
            }
        })
    }
    xt.prototype.get = function (e) {
        if (!e) return this._themes[this._active];
        var t = this._themes[e];
        if (!t) throw new Error("Cannot find theme with name: " + e);
        return t
    }, xt.prototype.use = function (e) {
        this._themes[e] ? this._active = e : console.error("Cannot find theme with name: " + e)
    }, xt.prototype.active = function () {
        return this._active
    }, xt.prototype.add = function (e, t) {
        t || (t = {}), t.palette = function (e) {
            e || (e = {});
            var t = e.mode || "light",
                n = e.primary || _t("primary", t),
                i = e.warn || _t("warn", t),
                o = e.grey || _t("grey", t),
                r = e.text || _t("text", t);
            return mt({
                common: gt,
                mode: t,
                primary: n,
                grey: o,
                warn: i,
                text: r
            }, e)
        }(t.palette), t.component = t.component || Object.create(null), this._themes[e] = t
    }, xt.prototype.extend = function (e, t) {
        "string" == typeof t && (t = JSON.parse(t));
        var n = JSON.parse(JSON.stringify(this.get(e)));
        return function e(t, n) {
            for (var i in n) {
                var o = n[i];
                switch (typeof o) {
                case "string":
                    t[i] = o;
                    break;
                case "object":
                    t[i] = t[i] || {}, e(t[i], o);
                    break;
                default:
                    throw new Error("Source theme contains invalid data types. Only string and object types are supported.")
                }
            }
        }(n, t), n
    }, xt.merge = function (e, t) {
        return mt(e, t || {})
    };
    var Ct = ["light", "dark", "contrast", "grey-red"],
        kt = new xt;
    kt.add("contrast", {}), kt.add("grey-red", {
        component: {
            challenge: {
                main: {
                    border: "#6a6a6a"
                }
            }
        }
    });
    var Et = function (e) {
        var t = [];
        for (var n in e) {
            var i = e[n];
            i = "object" == typeof i ? JSON.stringify(i) : i, t.push([encodeURIComponent(n), encodeURIComponent(i)].join("="))
        }
        return t.join("&")
    };

    function Ot(e, t) {
        this.id = e, this.width = null, this.height = null, this.mobile = !1, this.ready = !1, this.listeners = [], this.config = t, this._visible = !1, this._selected = !1, this.$iframe = new pe("iframe"), this._host = ee.host || window.location.hostname;
        var n = ee.assetUrl;
        te.assethost && (n = te.assethost + ee.assetUrl.replace(ee.assetDomain, "")), this.$iframe.dom.src = n + "/hcaptcha-challenge.html#id=" + this.id + "&host=" + this._host + (t ? "&" + Et(this.config) : ""), this.$iframe.dom.title = "Main content of the hCaptcha challenge", this.$iframe.dom.frameBorder = 0, this.$iframe.dom.scrolling = "no", this.setupParentContainer(t), this._hasCustomContainer ? (this._hideIframe(), this._parent.appendChild(this.$iframe.dom)) : (this.$container = new pe("div"), this.$wrapper = this.$container.createElement("div"), this.$overlay = this.$container.createElement("div"), this.$arrow = this.$container.createElement("div"), this.$arrow.fg = this.$arrow.createElement("div"), this.$arrow.bg = this.$arrow.createElement("div"), this.style.call(this), this.$wrapper.appendElement(this.$iframe), this._parent.appendChild(this.$container.dom), this.$container.setAttribute("aria-hidden", !0)), this.chat = ht.createChat(this.$iframe.dom, e)
    }

    function St(e, t, n) {
        this.id = t, this.response = null, this.location = {
            tick: null,
            offset: null,
            bounding: null
        }, this.config = n, this._ticked = !0, this.$container = e instanceof pe ? e : new pe(e), this._host = ee.host || window.location.hostname, this.$iframe = new pe("iframe");
        var i = ee.assetUrl;
        te.assethost && (i = te.assethost + ee.assetUrl.replace(ee.assetDomain, "")), this.$iframe.dom.src = i + "/hcaptcha-checkbox.html#id=" + this.id + "&host=" + this._host + (n ? "&" + Et(this.config) : ""), this.$iframe.dom.title = "widget containing checkbox for hCaptcha security challenge", this.$iframe.dom.tabIndex = this.config.tabindex || 0, this.$iframe.dom.frameBorder = "0", this.$iframe.dom.scrolling = "no", this.config.size && "invisible" === this.config.size && this.$iframe.setAttribute("aria-hidden", "true"), this.$iframe.setAttribute("data-hcaptcha-widget-id", t), this.$iframe.setAttribute("data-hcaptcha-response", ""), this.$container.appendElement(this.$iframe), "off" !== te.recaptchacompat && (this.$textArea0 = this.$container.createElement("textarea", "#g-recaptcha-response-" + t), this.$textArea0.dom.name = "g-recaptcha-response", this.$textArea0.css({
            display: "none"
        })), this.$textArea1 = this.$container.createElement("textarea", "#h-captcha-response-" + t), this.$textArea1.dom.name = "h-captcha-response", this.$textArea1.css({
            display: "none"
        }), this.chat = ht.createChat(this.$iframe.dom, t), this.clearLoading = this.clearLoading.bind(this)
    }

    function Pt(e, t, n) {
        if (!n.sitekey) throw new W;
        this.id = t, this.visible = !1, this.overflow = {
            override: !1,
            cssUsed: !0,
            value: null,
            scroll: 0
        }, this.onError = null, this.onPass = null, this.onExpire = null, this.onChalExpire = null, this.onOpen = null, this.onClose = null, this._ready = !1, this._active = !1, this._listeners = [], this.config = n, Ct.indexOf(n.theme) >= 0 && kt.use(n.theme), this._state = {
            escaped: !1,
            passed: !1,
            expiredChallenge: !1,
            expiredResponse: !1
        }, this._origData = null, this._promise = null, this._responseTimer = null, this.challenge = new Ot(t, n), this.checkbox = new St(e, t, n), this.initChallenge = this.initChallenge.bind(this), this.closeChallenge = this.closeChallenge.bind(this), this.displayChallenge = this.displayChallenge.bind(this), this.getGetCaptchaManifest = this.getGetCaptchaManifest.bind(this)
    }

    function It() {
        De(this, pe, "canvas");
        var e = this;
        this.element = this.dom, this.ctx = this.element.getContext("2d"), this.scale = 1, this.dpr = window.devicePixelRatio || 1, this.clearColor = "#fff", this.ctx.roundedRect = function (t, n, i, o, r) {
            var a = i > 0 ? r : -r,
                s = o > 0 ? r : -r;
            e.ctx.beginPath(), e.ctx.moveTo(t + a, n), e.ctx.lineTo(t + i - a, n), e.ctx.quadraticCurveTo(t + i, n, t + i, n + s), e.ctx.lineTo(t + i, n + o - s), e.ctx.quadraticCurveTo(t + i, n + o, t + i - a, n + o), e.ctx.lineTo(t + a, n + o), e.ctx.quadraticCurveTo(t, n + o, t, n + o - s), e.ctx.lineTo(t, n + s), e.ctx.quadraticCurveTo(t, n, t + a, n), e.ctx.closePath()
        }
    }

    function Bt(e) {
        e = e || {}, this.x = e.x || 0, this.y = e.y || 0, this.rotate = this.rotate.bind(this), this.getDistance = this.getDistance.bind(this), this.radius = 0, this.tolerance = 0, this.fill = !1, this.stroke = !1, this.fillColor = "#fff", this.strokeColor = "#fff", this.strokeWidth = 1
    }

    function Tt(e, t, n) {
        De(this, Bt, e), this.handleIn = new Bt(t), this.handleOut = new Bt(n), this.prev = null, this.next = null, this.index = 0
    }

    function jt(e) {
        if ("en" === e) return Promise.resolve();
        var t = e + ".json";
        return new Promise(function (n, i) {
            Le.retrieve(t).then(function (n) {
                return n || Le.file(t, {
                    prefix: "https://newassets.hcaptcha.com/captcha/v1/4ad5c92/static/i18n"
                }).then(function (t) {
                    return be.addTable(e, t.data), t
                })
            }).then(function (e) {
                n(e.data)
            }).catch(function (e) {
                i(e)
            })
        })
    }
    Ot.prototype.setupParentContainer = function (e) {
        var t, n = e["challenge-container"];
        n && (t = "string" == typeof n ? document.getElementById(n) : n), t ? (this._hasCustomContainer = !0, this._parent = t) : (this._hasCustomContainer = !1, this._parent = document.body)
    }, Ot.prototype._hideIframe = function () {
        var e = {};
        "ie" !== Z.Browser.type || "ie" === Z.Browser.type && 8 !== Z.Browser.version ? (e.opacity = 0, e.visibility = "hidden") : e.display = "none", this.$iframe.setAttribute("aria-hidden", !0), this.$iframe.css(e)
    }, Ot.prototype._showIframe = function () {
        var e = {};
        "ie" !== Z.Browser.type || "ie" === Z.Browser.type && 8 !== Z.Browser.version ? (e.opacity = 1, e.visibility = "visible") : e.display = "block", this.$iframe.removeAttribute("aria-hidden"), this.$iframe.css(e)
    }, Ot.prototype.style = function () {
        var e = function (e) {
            var t = e.palette,
                n = e.component;
            return xt.merge({
                main: {
                    fill: t.common.white,
                    border: t.grey[400]
                }
            }, n.challenge)
        }(kt.get());
        if (this._hasCustomContainer) this.$iframe.css({
            border: 0,
            position: "relative",
            backgroundColor: e.main.fill
        });
        else {
            var t = {
                backgroundColor: e.main.fill,
                border: "1px solid " + e.main.border,
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 4px",
                borderRadius: 4,
                left: -1e4,
                top: -1e4,
                zIndex: -9999999999999,
                position: "absolute"
            };
            "ie" !== Z.Browser.type || "ie" === Z.Browser.type && 8 !== Z.Browser.version ? (t.transition = "opacity 0.15s ease-out", t.opacity = 0, t.visibility = "hidden") : t.display = "none", this.$container.css(t), this.$wrapper.css({
                position: "relative",
                zIndex: 1
            }), this.$overlay.css({
                width: "100%",
                height: "100%",
                position: "fixed",
                pointerEvents: "none",
                top: 0,
                left: 0,
                zIndex: 0,
                backgroundColor: e.main.fill,
                opacity: .05
            }), this.$arrow.css({
                borderWidth: 11,
                position: "absolute",
                pointerEvents: "none",
                marginTop: -11,
                zIndex: 1,
                right: "100%"
            }), this.$arrow.fg.css({
                borderWidth: 10,
                borderStyle: "solid",
                borderColor: "transparent rgb(255, 255, 255) transparent transparent",
                position: "relative",
                top: 10,
                zIndex: 1
            }), this.$arrow.bg.css({
                borderWidth: 11,
                borderStyle: "solid",
                borderColor: "transparent " + e.main.border + " transparent transparent",
                position: "relative",
                top: -11,
                zIndex: 0
            }), this.$iframe.css({
                border: 0,
                zIndex: 2e9,
                position: "relative"
            })
        }
    }, Ot.prototype.setup = function (e) {
        return this.chat.send("create-challenge", e)
    }, Ot.prototype.sendTranslation = function (e) {
        var t = {
            locale: e,
            table: be.getTable(e) || {}
        };
        this.chat && this.chat.send("challenge-translate", t)
    }, Ot.prototype.isVisible = function () {
        return this._visible
    }, Ot.prototype.getDimensions = function (e, t) {
        return this._visible ? this.chat.contact("resize-challenge", {
            width: e,
            height: t
        }) : Promise.resolve(null)
    }, Ot.prototype.show = function () {
        if (!0 !== this._visible)
            if (this._visible = !0, this._hasCustomContainer) this._showIframe();
            else {
                var e = {
                    zIndex: 9999999999999
                };
                "ie" !== Z.Browser.type || "ie" === Z.Browser.type && 8 !== Z.Browser.version ? (e.opacity = 1, e.visibility = "visible") : e.display = "block", this.$container.css(e), this.$container.removeAttribute("aria-hidden"), this.$overlay.css({
                    pointerEvents: "auto",
                    cursor: "pointer"
                }), this.$iframe.dom.focus()
            }
    }, Ot.prototype.close = function (e) {
        if (this._visible = !1, this._hasCustomContainer) return this._hideIframe(), void this.chat.send("close-challenge", {
            event: e
        });
        var t = {
            left: -1e4,
            top: -1e4,
            zIndex: -9999999999999
        };
        "ie" !== Z.Browser.type || "ie" === Z.Browser.type && 8 !== Z.Browser.version ? (t.opacity = 0, t.visibility = "hidden") : t.display = "none", this.$container.css(t), this._hasCustomContainer || this.$overlay.css({
            pointerEvents: "none",
            cursor: "default"
        }), this.chat.send("close-challenge", {
            event: e
        }), this.$container.setAttribute("aria-hidden", !0)
    }, Ot.prototype.size = function (e, t, n) {
        this.width = e, this.height = t, this.mobile = n, this.$iframe.css({
            width: e,
            height: t
        }), this._hasCustomContainer || (this.$wrapper.css({
            width: e,
            height: t
        }), n ? this.$overlay.css({
            opacity: .5
        }) : this.$overlay.css({
            opacity: .05
        }))
    }, Ot.prototype.position = function (e) {
        if (!this._hasCustomContainer && e) {
            var t = window.document.documentElement,
                n = Z.Browser.scrollY(),
                i = Z.Browser.width(),
                o = Z.Browser.height(),
                r = this.mobile || "invisible" === this.config.size || e.offset.left + e.tick.x <= e.tick.width / 2,
                a = Math.round(e.bounding.top) + n !== e.offset.top,
                s = this.height > t.clientHeight,
                c = r ? (i - this.width) / 2 : e.bounding.left + e.tick.right + 10;
            (c + this.width + 10 > i || c < 0) && (c = (i - this.width) / 2, r = !0);
            var h = (t.scrollHeight < t.clientHeight ? t.clientHeight : t.scrollHeight) - this.height - 10,
                l = r ? (o - this.height) / 2 + n : e.bounding.top + e.tick.y + n - this.height / 2;
            a && l < n && (l = n + 10), a && l + this.height >= n + o && (l = n + o - (this.height + 10)), l = Math.max(Math.min(l, h), 10);
            var d = e.bounding.top + e.tick.y + n - l - 10,
                u = this.height - 10 - 30;
            return d = Math.max(Math.min(d, u), 10), this.$container.css({
                left: c,
                top: l
            }), this.$arrow.fg.css({
                display: r ? "none" : "block"
            }), this.$arrow.bg.css({
                display: r ? "none" : "block"
            }), this.$arrow.css({
                top: d
            }), this.top = l, this.$container.dom.getBoundingClientRect(), s
        }
    }, Ot.prototype.destroy = function () {
        this._visible && this.close.call(this), this._hasCustomContainer ? this._parent.removeChild(this.$iframe.dom) : (this._parent.removeChild(this.$container.dom), this.$container = this.$container.__destroy()), this.$iframe = this.$iframe.__destroy(), ht.removeChat(this.chat), this.chat = this.chat.destroy()
    }, Ot.prototype.setReady = function (e) {
        if (this.ready = e, this.ready)
            for (var t, n = this.listeners.length; --n > -1;) t = this.listeners[n], this.listeners.splice(n, 1), t()
    }, Ot.prototype.onReady = function (e) {
        var t = Array.prototype.slice.call(arguments, 1),
            n = function () {
                e.apply(null, t)
            };
        this.ready ? n() : this.listeners.push(n)
    }, Ot.prototype.onOverlayClick = function (e) {
        this._hasCustomContainer || this.$overlay.addEventListener("click", e)
    }, Ot.prototype.setConfig = function (e) {
        return this.chat ? this.chat.contact("challenge-update", e) : Promise.resolve()
    }, Ot.prototype.setData = function (e) {
        this.chat && this.chat.send("challenge-data", e)
    }, St.prototype.setResponse = function (e) {
        this.response = e, this.$iframe.dom.setAttribute("data-hcaptcha-response", e), "off" !== te.recaptchacompat && (this.$textArea0.dom.value = e), this.$textArea1.dom.value = e
    }, St.prototype.style = function () {
        switch (this.config.size) {
        case "compact":
            this.$iframe.css({
                width: 164,
                height: 144
            });
            break;
        case "invisible":
            this.$iframe.css({
                display: "none"
            });
            break;
        default:
            this.$iframe.css({
                width: 303,
                height: 78,
                overflow: "hidden"
            })
        }
    }, St.prototype.reset = function () {
        this._ticked = !1, this.chat && this.chat.send("checkbox-reset")
    }, St.prototype.clearLoading = function () {
        this.chat && this.chat.send("checkbox-clear")
    }, St.prototype.sendTranslation = function (e) {
        var t = {
            locale: e,
            table: be.getTable(e) || {}
        };
        this.chat && this.chat.send("checkbox-translate", t)
    }, St.prototype.status = function (e, t) {
        this.chat && this.chat.send("checkbox-status", {
            text: e || null,
            a11yOnly: t || !1
        })
    }, St.prototype.tick = function () {
        this._ticked = !0, this.chat && this.chat.send("checkbox-tick")
    }, St.prototype.getTickLocation = function () {
        return this.chat.contact("checkbox-location")
    }, St.prototype.getOffset = function () {
        var e = this.$iframe.dom;
        e.offsetParent || (e = e.parentElement);
        for (var t = 0, n = 0; e;) t += e.offsetLeft, n += e.offsetTop, e = e.offsetParent;
        return {
            top: n,
            left: t
        }
    }, St.prototype.getBounding = function () {
        return this.$iframe.dom.getBoundingClientRect()
    }, St.prototype.destroy = function () {
        this._ticked && this.reset(), this.$container.removeElement(this.$iframe), this.$container.removeElement(this.$textArea1), "off" !== te.recaptchacompat && (this.$container.removeElement(this.$textArea0), this.$textArea0 = this.$textArea0.__destroy()), this.$textArea1 = this.$textArea1.__destroy(), this.$container = this.$container.__destroy(), this.$iframe = this.$iframe.__destroy(), ht.removeChat(this.chat), this.chat = this.chat.destroy()
    }, Pt.prototype._resetTimer = function () {
        null !== this._responseTimer && (clearTimeout(this._responseTimer), this._responseTimer = null)
    }, Pt.prototype.initChallenge = function (e) {
        e || (e = {}), this._origData = e;
        var t = this.getGetCaptchaManifest(),
            n = e.charity || null,
            i = e.a11yChallenge || !1,
            o = e.link || null,
            r = e.action || "",
            a = e.rqdata || null,
            s = Z.Browser.width(),
            c = Z.Browser.height();
        this._active = !0, this._resetTimer(), this._resetState(), this.checkbox.setResponse(""), this.challenge.setup({
            a11yChallenge: i,
            manifest: t,
            width: s,
            height: c,
            charity: n,
            link: o,
            action: r,
            rqdata: a,
            wdata: dt()
        })
    }, Pt.prototype.getGetCaptchaManifest = function () {
        var e = (this._origData || {}).manifest || null;
        return e || ((e = Object.create(null)).st = Date.now()), e.v = 1, e.topLevel = Ge.getData(), e.session = J.getSession(), e.widgetList = J.getCaptchaIdList(), e.widgetId = this.id, e.href = window.location.href, e.prev = JSON.parse(JSON.stringify(this._state)), e
    }, Pt.prototype.displayChallenge = function (e) {
        if (this._active) {
            var t = this;
            this.visible = !0;
            var n = this.checkbox,
                i = this.challenge,
                o = Z.Browser.height();
            if ("ie" !== Z.Browser.type || 8 !== Z.Browser.version) {
                var r = window.getComputedStyle(document.body).getPropertyValue("overflow-y");
                this.overflow.override = "hidden" === r, this.overflow.override && (this.overflow.cssUsed = "" === document.body.style.overflow && "" === document.body.style.overflowY, this.overflow.cssUsed || (this.overflow.value = "" === r ? "auto" : r), this.overflow.scroll = Z.Browser.scrollY(), document.body.style.overflowY = "auto")
            }
            return new Promise(function (r) {
                n.status(), n.getTickLocation().then(function (a) {
                    t._active && (i.size(e.width, e.height, e.mobile), i.show(), n.clearLoading(), n.location.bounding = n.getBounding(), n.location.tick = a, n.location.offset = n.getOffset(), i.position(n.location) && ((window.document.scrollingElement || document.getElementsByTagName("html")[0]).scrollTop = Math.abs(i.height - o) + i.top), r())
                })
            }).then(function () {
                t.onOpen && se(t.onOpen)
            })
        }
    }, Pt.prototype.resize = function (e, t, n) {
        var i = this,
            o = this.checkbox,
            r = this.challenge;
        r.getDimensions(e, t).then(function (e) {
            e && r.size(e.width, e.height, e.mobile), o.location.bounding = o.getBounding(), o.location.offset = o.getOffset(), Z.System.mobile && !n || r.position(o.location)
        }).catch(function (e) {
            i.closeChallenge.call(i, {
                event: A,
                message: "Captcha resize caused error.",
                error: e
            })
        })
    }, Pt.prototype.position = function () {
        var e = this.checkbox,
            t = this.challenge;
        Z.System.mobile || (e.location.bounding = e.getBounding(), t.position(e.location))
    }, Pt.prototype.reset = function () {
        this.checkbox.reset(), this.checkbox.setResponse(""), this._resetTimer(), this._resetState()
    }, Pt.prototype._resetState = function () {
        for (var e in this._state) this._state[e] = !1
    }, Pt.prototype.closeChallenge = function (e) {
        this.visible = !1, this._active = !1;
        var t = this,
            n = this.checkbox,
            i = this.challenge;
        this.overflow.override && ((window.document.scrollingElement || document.getElementsByTagName("html")[0]).scrollTop = this.overflow.scroll, this.overflow.override = !1, this.overflow.scroll = 0, document.body.style.overflowY = this.overflow.cssUsed ? null : this.overflow.value);
        var o = e.response || "";
        switch (n.setResponse(o), i.close(e.event), n.$iframe.dom.focus(), e.event) {
        case I:
            this._state.escaped = !0, n.reset(), t.onClose && se(t.onClose), t._promise && t._promise.reject(B);
            break;
        case T:
            this._state.expiredChallenge = !0, n.reset(), n.status("hCaptcha window closed due to timeout.", !0), t.onChalExpire && se(t.onChalExpire), t._promise && t._promise.reject(T);
            break;
        case A:
        case j:
        case M:
            var r = e.event;
            n.reset(), e.event === M ? (n.status(e.message), 429 === e.status ? r = "rate-limited" : "invalid-data" === e.message && (r = "invalid-data")) : e.event === j ? r = A : e.event === A && "Answers are incomplete" === e.message && (r = "incomplete-answer"), this.onError && se(this.onError, r), t._promise && t._promise.reject(r);
            break;
        case "challenge-passed":
            this._state.passed = !0, n.tick(), this.onPass && se(this.onPass, o), t._promise && t._promise.resolve({
                response: o,
                key: rt(this.id)
            }), "number" == typeof e.expiration && (t._resetTimer(), t._responseTimer = setTimeout(function () {
                try {
                    n.reset(), n.setResponse(""), n.status("hCaptcha security token has expired. Please complete the challenge again.", !0)
                } catch (e) {
                    re("Checkbox not present or could not destroy on expiration: " + e.message, "error", "global")
                }
                t.onExpire && se(t.onExpire), t._responseTimer = null, t._state.expiredResponse = !0
            }, 1e3 * e.expiration))
        }
        t._promise = null
    }, Pt.prototype.updateTranslation = function (e) {
        this.checkbox.sendTranslation(e), this.challenge.sendTranslation(e)
    }, Pt.prototype.isReady = function () {
        return this._ready
    }, Pt.prototype.setReady = function (e) {
        if (this._ready = e, this._ready)
            for (var t, n = this._listeners.length; --n > -1;) t = this._listeners[n], this._listeners.splice(n, 1), t()
    }, Pt.prototype.setPromise = function (e) {
        this._promise = e
    }, Pt.prototype.onReady = function (e) {
        var t = Array.prototype.slice.call(arguments, 1),
            n = function () {
                e.apply(null, t)
            };
        this._ready ? n() : this._listeners.push(n)
    }, Pt.prototype.destroy = function () {
        this._resetTimer(), this.overflow.override && ((window.document.scrollingElement || document.getElementsByTagName("html")[0]).scrollTop = this.overflow.scroll, this.overflow.override = !1, this.overflow.scroll = 0, document.body.style.overflowY = this.overflow.cssUsed ? null : this.overflow.value), this.challenge.destroy(), this.checkbox.destroy(), this.challenge = null, this.checkbox = null
    }, Pt.prototype.setSiteConfig = function (e) {
        var t = e && e.features && e.features.custom_theme;
        if (this.config.themeConfig && t) {
            var n = "custom-" + this.id;
            kt.add(n, kt.extend(kt.active(), this.config.themeConfig)), kt.use(n), this.challenge.style()
        }
        return this.challenge.setConfig({
            siteConfig: e,
            wdata: dt()
        })
    }, Re(It, pe), It.prototype.dimensions = function (e, t) {
        this.css({
            width: e,
            height: t
        }), this.element.width = Math.round(e / this.scale) * this.dpr, this.element.height = Math.round(t / this.scale) * this.dpr, this.ctx.scale(this.dpr, this.dpr), this.width = Math.round(e / this.scale), this.height = Math.round(t / this.scale)
    }, It.prototype.clear = function () {
        this.ctx && this.ctx.clearRect(0, 0, this.element.width, this.element.height)
    }, It.prototype.draw = function () {
        this.ctx && (this.ctx.fillStyle = this.clearColor, this.ctx.fillRect(0, 0, this.element.width, this.element.height))
    }, It.prototype._destroy = function () {
        this.__destroy(), this.element = null, this.ctx = null, this.width = null, this.height = null
    }, Bt.prototype.rotate = function (e, t) {
        var n = t * (Math.PI / 180),
            i = Math.sin(n),
            o = Math.cos(n),
            r = this.x - e.x,
            a = this.y - e.y;
        this.x = r * o - a * i + e.x, this.y = r * i + a * o + e.y
    }, Bt.prototype.getDistance = function (e) {
        return Math.sqrt(Math.pow(this.x - e.x, 2) + Math.pow(this.y - e.y, 2))
    }, Bt.prototype.getAngle = function (e) {
        var t = e.x - this.x,
            n = e.y - this.y,
            i = 180 * Math.atan2(n, t) / Math.PI;
        return i < 0 && (i += 360), i
    }, Bt.prototype.hitTest = function (e) {
        return this.radius + this.tolerance >= this.getDistance(e)
    }, Bt.prototype.restrict = function (e, t, n, i) {
        if ("x" !== e && "y" !== e) throw new Error("Point.restrict requires a value: x or y");
        return t + this[e] < n ? t = this[e] - n : t + this[e] > i && (t = i - this[e]), this[e] + t
    }, Bt.prototype.draw = function (e) {
        e.ctx.beginPath(), e.ctx.arc(this.x, this.y, this.radius / e.scale, 0, 2 * Math.PI, !1), this.fill && (e.ctx.fillStyle = this.fillColor, e.ctx.fill()), this.stroke && (e.ctx.strokeStyle = this.strokeColor, e.ctx.lineWidth = this.strokeWidth / e.scale, e.ctx.stroke())
    }, Re(Tt, Bt), Tt.prototype.set = function (e, t, n) {
        this.x = e.x || this.x, this.y = e.y || this.y, void 0 === t ? (this.handleIn.x = this.x, this.handleIn.y = this.y) : (this.handleIn.x = t.x, this.handleIn.y = t.y), void 0 === n ? (this.handleOut.x = this.x, this.handleOut.y = this.y) : (this.handleOut.x = n.x, this.handleOut.y = n.y)
    }, Tt.prototype.clone = function () {
        var e = {
                x: this.x,
                y: this.y
            },
            t = {
                x: this.handleIn.x,
                y: this.handleIn.y
            },
            n = {
                x: this.handleOut.x,
                y: this.handleOut.y
            },
            i = new Tt;
        return t.x === n.x && t.y === n.y ? i.set(e) : i.set(e, t, n), i.index = this.index, i.prev = this.prev, i.next = this.next, i.radius = this.radius, i.tolerance = this.tolerance, i.fill = this.fill, i.stroke = this.stroke, i.fillColor = this.fillColor, i.strokeColor = this.strokeColor, i.strokeWidth = this.strokeWidth, i
    }, Tt.prototype.move = function (e, t) {
        this.x += e, this.y += t, this.handleIn.x += e, this.handleIn.y += t, this.handleOut.x += e, this.handleOut.y += t
    }, Tt.prototype.render = function (e) {
        this.handleIn.x !== this.x && this.handleIn.y !== this.y && this.handleIn.draw(e), this.handleOut.x !== this.x && this.handleOut.y !== this.y && this.handleOut.draw(e), this.draw(e)
    };
    var Mt = 0,
        At = ["hl", "custom", "tplinks", "sitekey", "theme", "size", "tabindex", "challenge-container"],
        $t = {
            render: function (e, t) {
                try {
                    let e = document.createElement("button");
                    e.id = "anycaptchaSolveButton", t.callback + "" != "undefined" && (e.onclick = t.callback), document.body.appendChild(e)
                } catch (e) {
                    console.log("no have callback")
                }
                if ("string" == typeof e && (e = document.getElementById(e)), e && 1 === e.nodeType)
                    if (function (e) {
                            if (!(e && "challenge-container" in e)) return !0;
                            var t = e["challenge-container"];
                            return "string" == typeof t && (t = document.getElementById(t)), !!t && 1 === t.nodeType
                        }(t)) {
                        if (!1 !== ht.isSupported()) {
                            for (var n, i, o = e.getElementsByTagName("iframe"), r = -1; ++r < o.length && !n;)(i = o[r].getAttribute("data-hcaptcha-widget-id")) && (n = !0);
                            if (n) return console.error("Only one captcha is permitted per parent container."), i;
                            var a = function (e, t) {
                                    for (var n = ["hl", "custom", "tplinks", "sitekey", "theme", "type", "size", "tabindex", "callback", "expired-callback", "chalexpired-callback", "error-callback", "open-callback", "close-callback", "endpoint", "challenge-container"], i = {}, o = 0; o < n.length; o++) {
                                        var r = n[o],
                                            a = t && t[r];
                                        a || (a = e.getAttribute("data-" + r)), a && (i[r] = a)
                                    }
                                    return i
                                }(e, t),
                                s = Mt++ + Math.random().toString(36).substr(2),
                                c = {
                                    sentry: ie,
                                    reportapi: te.reportapi,
                                    recaptchacompat: te.recaptchacompat,
                                    custom: te.custom
                                };
                            te.endpointOverride && (c.endpoint = te.endpointOverride), null !== te.language && (c.hl = be.getLocale()), te.assethost && (c.assethost = te.assethost), te.imghost && (c.imghost = te.imghost), te.tplinks && (c.tplinks = te.tplinks), te.se && (c.se = te.se);
                            for (var h = 0; h < At.length; h++) {
                                var l = At[h];
                                l in a && (c[l] = a[l])
                            }
                            if (c.theme = te.theme, a.theme) try {
                                var d = a.theme;
                                "string" == typeof d && (d = JSON.parse(d)), c.themeConfig = d
                            } catch (e) {
                                c.theme = d
                            }
                            if (e instanceof HTMLButtonElement || e instanceof HTMLInputElement) {
                                var u = new pe("div", ".h-captcha");
                                u.css({
                                    display: "none"
                                });
                                for (var p = null, f = 0; f < e.attributes.length; f++)(p = e.attributes[f]).name.startsWith("data-") && u.setAttribute(p.name, p.value);
                                var m = e.tagName.toLowerCase() + "[data-hcaptcha-widget-id='" + s + "']";
                                e.setAttribute("data-hcaptcha-widget-id", s), u.setAttribute("data-hcaptcha-source-id", m), e.parentNode.insertBefore(u.dom, e), e.onclick = function (e) {
                                    return e.preventDefault(), ot(s)
                                }, e = u, c.size = "invisible"
                            }
                            try {
                                var g = new Pt(e, s, c);
                                g.challenge.style(), g.checkbox.style()
                            } catch (t) {
                                var y = "Your browser plugins or privacy policies are blocking the hCaptcha service. Please disable them for hCaptcha.com";
                                return t instanceof W && (y = "hCaptcha has failed to initialize. Please see the developer tools console for more information.", console.error(t.message)), void ne(e, y)
                            }
                            return a.callback && (g.onPass = a.callback), a["expired-callback"] && (g.onExpire = a["expired-callback"]), a["chalexpired-callback"] && (g.onChalExpire = a["chalexpired-callback"]), a["open-callback"] && (g.onOpen = a["open-callback"]), a["close-callback"] && (g.onClose = a["close-callback"]), a["error-callback"] && (g.onError = a["error-callback"]), Ge.setData("inv", "invisible" === c.size), g.checkbox.chat.listen("checkbox-selected", function (e) {
                                Ge.setData("exec", !1), g.onReady(g.initChallenge, e)
                            }), g.checkbox.chat.listen("checkbox-loaded", function (e) {
                                g.checkbox.location.bounding = g.checkbox.getBounding(), g.checkbox.location.tick = e, g.checkbox.location.offset = g.checkbox.getOffset(), g.checkbox.sendTranslation(c.hl)
                            }), g.checkbox.chat.listen("checkbox-setup", function (e) {
                                te.endpointOverride && (e.endpoint = null), g.challenge.onReady(function () {
                                    g.setSiteConfig(e).then(function () {
                                        g.setReady(!0)
                                    })
                                })
                            }), g.challenge.chat.listen("challenge-loaded", function () {
                                g.challenge.setReady(!0), g.challenge.sendTranslation(c.hl)
                            }), g.challenge.chat.answer("challenge-ready", function (e, t) {
                                g.displayChallenge(e).then(t.resolve)
                            }), g.challenge.chat.listen("challenge-resize", function () {
                                var e = Z.Browser.width(),
                                    t = Z.Browser.height();
                                g.resize(e, t)
                            }), g.challenge.chat.listen(B, g.closeChallenge), g.challenge.chat.answer("get-url", function (e) {
                                e.resolve(window.location.href)
                            }), g.challenge.chat.answer("getcaptcha-manifest", function (e) {
                                e.resolve(g.getGetCaptchaManifest())
                            }), g.challenge.chat.answer("check-api", function (e) {
                                e.resolve(Ge.getData())
                            }), g.challenge.chat.listen("challenge-key", function (e) {
                                J.pushSession(e.key, g.id)
                            }), g.challenge.onOverlayClick(function () {
                                g.closeChallenge({
                                    event: I
                                })
                            }), g.challenge.chat.listen("challenge-language", v), v({
                                locale: c.hl
                            }, !0), g.challenge.chat.answer("get-ac", function (e) {
                                e.resolve(lt.hasCookie("hc_accessibility"))
                            }), J.add(g), s
                        }
                        ne(e, "Your browser is missing or has disabled Cross-Window Messaging. Please <a style='color:inherit;text-decoration:underline; font: inherit' target='_blank' href='https://www.whatismybrowser.com/guides/how-to-update-your-browser/auto'>upgrade your browser</a> or enable it for hCaptcha.com")
                    } else console.log("[hCaptcha] render: invalid challenge container '" + t["challenge-container"] + "'.");
                else console.log("[hCaptcha] render: invalid container '" + e + "'.");

                function v(e, t) {
                    var n = e.locale;

                    function i(e) {
                        if (e) try {
                            e.updateTranslation(n)
                        } catch (e) {
                            re("Failed to update text translation: " + JSON.stringify(e), "error", "translation")
                        }
                    }
                    n && jt(n).then(function () {
                        t ? i(g) : J.each(i)
                    }).catch(function (e) {
                        re("Language failed to load: " + n, "error", "api")
                    })
                }
            },
            reset: function (e) {
                var t;
                if (e) {
                    if (!(t = J.getById(e))) throw new N(e);
                    t.reset()
                } else {
                    if (!(t = J.getByIndex(0))) throw new z;
                    t.reset()
                }
            },
            remove: function (e) {
                var t = e ? J.getById(e) : J.getByIndex(0);
                if (!t) throw e ? new N(e) : new z;
                J.remove(t), t.destroy(), t = null
            },
            execute: ot,
            getResponse: function (e) {
                var t, n;
                if ((n = e ? J.getById(e) : J.getByIndex(0)) && (t = n.checkbox.response || ""), void 0 !== t) return t;
                throw e ? new N(e) : new z
            },
            getRespKey: rt,
            close: function (e) {
                var t = !1;
                if (!(t = e ? J.getById(e) : J.getByIndex(0))) throw e ? new N(e) : new z;
                t.closeChallenge({
                    event: I
                })
            },
            setData: function (e, t) {
                if ("object" != typeof e || t || (t = e, e = null), !t || "object" != typeof t) throw Error("[hCaptcha] invalid data supplied");
                var n = !1;
                if (!(n = e ? J.getById(e) : J.getByIndex(0))) throw e ? new N(e) : new z;
                var i = n.challenge.setData.bind(n.challenge);
                n.onReady(i, t)
            },
            nodes: J
        };
    ee.file = "hcaptcha";
    var Lt = document.currentScript,
        Dt = !1,
        Rt = !1,
        Nt = "on",
        zt = Z.Browser.width() / Z.Browser.height(),
        Wt = window.hcaptcha || !1;

    function Ft() {
        var e = Z.Browser.width(),
            t = Z.Browser.height(),
            n = Z.System.mobile && zt !== e / t;
        zt = e / t, qt(), $t.nodes.each(function (i) {
            i.visible && i.resize(e, t, n)
        })
    }

    function Ut(e) {
        e.preventDefault && e.preventDefault(), Jt(), $t.nodes.each(function (e) {
            e.visible && e.position()
        })
    }

    function Jt() {
        Ge.circBuffPush("xy", [Z.Browser.scrollX(), Z.Browser.scrollY(), document.documentElement.clientWidth / Z.Browser.width(), Date.now()])
    }

    function qt() {
        Ge.circBuffPush("wn", [Z.Browser.width(), Z.Browser.height(), Z.System.dpr(), Date.now()])
    }! function (e) {
        var t = Array.prototype.slice.call(arguments, 1);
        !0 !== et && "interactive" !== document.readyState && "loaded" !== document.readyState && "complete" !== document.readyState ? (Ke.push({
            fn: e,
            args: t
        }), !1 === Ze && (document.addEventListener ? (document.addEventListener("DOMContentLoaded", nt), window.addEventListener("load", nt)) : (document.attachEvent("onreadystatechange", tt), window.attachEvent("onload", nt)), Ze = !0)) : setTimeout(function () {
            e()
        }, 1)
    }(function () {
        var e;
        Wt || (function () {
            var e;
            e = Lt ? [Lt] : document.getElementsByTagName("script");
            for (var t = -1, n = !1, i = null, o = null; ++t < e.length && !1 === n;) e[t] && e[t].src && (o = (i = e[t].src.split("?"))[0], /\/(hcaptcha|1\/api)\.js$/.test(o) && (n = e[t], o && -1 !== o.toLowerCase().indexOf("www.") && console.warn("[hCaptcha] JS API is being loaded from www.hcaptcha.com. Please use https://js.hcaptcha.com/1/api.js")));
            if (!1 !== n) {
                var r, a = function (e) {
                    for (var t, n, i, o = {}, r = e ? e.indexOf("&") >= 0 ? e.split("&") : [e] : [], a = 0; a < r.length; a++)
                        if (r[a].indexOf("=") >= 0) {
                            if (t = r[a].split("="), n = decodeURIComponent(t[0]), "false" !== (i = decodeURIComponent(t[1])) && "true" !== i || (i = "true" === i), "theme" === n || "themeConfig" === n) try {
                                i = JSON.parse(i)
                            } catch (e) {}
                            o[n] = i
                        } return o
                }(i[1]);
                Dt = a.onload || !1, Rt = a.render || !1, "off" === a.tplinks && (Nt = "off"), te.tplinks = Nt, te.language = a.hl || null, a.endpoint && (te.endpointOverride = a.endpoint), te.reportapi = a.reportapi || te.reportapi, te.assethost = a.assethost || null, te.imghost = a.imghost || null, te.custom = a.custom || te.custom, te.se = a.se || null, te.recaptchacompat = a.recaptchacompat || te.recaptchacompat, ee.host = a.host || window.location.hostname, te.language = te.language || window.navigator.userLanguage || window.navigator.language, be.setLocale(te.language), r = void 0 === a.sentry || a.sentry, ie = r, "off" === te.recaptchacompat ? console.log("recaptchacompat disabled") : window.grecaptcha = Ht
            }
        }(), (e = be.getLocale()).indexOf("en") >= 0 || jt(e).then(function () {
            $t.nodes.each(function (t) {
                if (t) try {
                    t.updateTranslation(e)
                } catch (e) {
                    re("Failed to update text translation: " + JSON.stringify(e), "error", "translation")
                }
            })
        }).catch(function () {
            re("Language failed to load: " + e, "error", "api")
        }), !1 === Rt || "onload" === Rt ? function (e) {
            for (var t = document.getElementsByClassName("h-captcha"), n = [], i = 0; i < t.length; i++) n.push(t[i]);
            var o = [];
            if ("off" !== te.recaptchacompat)
                for (var r = document.getElementsByClassName("g-recaptcha"), a = 0; a < r.length; a++) o.push(r[a]);
            for (var s = [].concat(n, o), c = 0; c < s.length; c++) e(s[c])
        }($t.render) : "explicit" !== Rt && console.log("hcaptcha: invalid render parameter '" + Rt + "', using 'explicit' instead."), Dt && setTimeout(function () {
            se(Dt)
        }, 1), function () {
            try {
                Ge.record(), Ge.setData("sc", Z.Browser.getScreenDimensions()), Ge.setData("nv", Z.Browser.interrogateNavigator()), Ge.setData("dr", document.referrer), qt(), Jt()
            } catch (e) {}
        }(), it.addEventListener("resize", Ft), it.addEventListener("scroll", Ut))
    });
    var Ht = {
        render: $t.render,
        remove: $t.remove,
        execute: $t.execute,
        reset: $t.reset,
        close: $t.close,
        setData: $t.setData,
        getResponse: $t.getResponse,
        getRespKey: $t.getRespKey
    };
    return Ht
}();