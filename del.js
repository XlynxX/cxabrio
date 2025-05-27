jQuery.fn.exists = function () {
    return this.length > 0
}
    ;
typeof Teleopti == "undefined" && (Teleopti = {},
    typeof Teleopti.SSO == "undefined" && (Teleopti.SSO = {},
        typeof Teleopti.SSO.Authentication == "undefined" && (Teleopti.SSO.Authentication = {})));
Teleopti.SSO.Authentication.AuthenticationState = function (n) {
    function r(n) {
        var t = s("__RequestVerificationToken_MainWeb");
        t && (n.headers ? n.headers["X-XSRF-TOKEN"] = t : n.headers = {
            "X-XSRF-TOKEN": t
        })
    }
    var i = this, t, f = Teleopti.SSO.Authentication.Navigation.GotoReturnUrl, e = Teleopti.SSO.Authentication.Navigation.GotoChangePassword, o = Teleopti.SSO.Authentication.Navigation.GotoMustChangePassword, s = function (n) {
        for (var r = n + "=", u = document.cookie.split(";"), t, i = 0; i < u.length; i++) {
            for (t = u[i]; t.charAt(0) === " ";)
                t = t.substring(1);
            if (t.indexOf(r) === 0)
                return t.substring(r.length, t.length)
        }
        return ""
    }, h = function (u) {
        r(u);
        $.extend(u, {
            url: n.baseUrl + "SSO/ApplicationAuthenticationApi/Password",
            dataType: "json",
            type: "POST",
            cache: !1,
            data: t,
            success: function (n) {
                if (n.Failed) {
                    u.errormessage(n.Message);
                    return
                }
                if (n.WillExpireSoon) {
                    e();
                    return
                }
                if (n.AlreadyExpired) {
                    o();
                    return
                }
                i.GotoReturnUrl(t.rememberMe)
            }
        });
        $.ajax(u)
    }, u;
    this.GotoReturnUrl = function (n) {
        f(Teleopti.SSO.Authentication.Settings.returnUrl, Teleopti.SSO.Authentication.Settings.pendingRequest, n)
    }
        ;
    this.CheckState = function () {
        return t ? !0 : !1
    }
        ;
    u = function (u) {
        r(u);
        $.extend(u, {
            url: n.baseUrl + "SSO/ApplicationAuthenticationApi/Password",
            dataType: "json",
            type: "PUT",
            cache: !1,
            success: function (n) {
                if (n.Failed) {
                    u.errormessage(n.Message);
                    return
                }
                t.password = u.data.newPassword;
                i.GotoReturnUrl(t.rememberMe)
            }
        });
        $.ajax(u)
    }
        ;
    this.ApplyChangePassword = function (n) {
        n.data.UserName = t.username;
        u(n)
    }
        ;
    this.TryToSignIn = function (n) {
        t = n.data;
        var i = function (t, i, r) {
            n.errormessage("An error has occurred, please try again.");
            console && console.error && console.error("Method Failed: " + t.responseText + i + r)
        };
        $.extend(n, {
            error: i
        });
        h(n)
    }
}
    ;
Teleopti.SSO.Authentication.ChangePasswordView = function (n) {
    this.Display = function (t) {
        if (!n.authenticationState.CheckState()) {
            Teleopti.SSO.Authentication.Navigation.GotoSignIn();
            return
        }
        var i = new Teleopti.SSO.Authentication.ChangePasswordViewModel({
            baseUrl: Teleopti.SSO.Authentication.Settings.baseUrl,
            mustChangePassword: t.mustChangePassword,
            authenticationState: n.authenticationState
        });
        t.render(n.html);
        ko.cleanNode(t.element[0]);
        ko.applyBindings(i, t.element[0])
    }
}
    ;
Teleopti.SSO.Authentication.ChangePasswordViewModel = function (n) {
    var t = this;
    this.MustChangePassword = ko.observable(n.mustChangePassword);
    this.NewPassword = ko.observable("");
    this.ConfirmNewPassword = ko.observable("");
    this.OldPassword = ko.observable("");
    this.ErrorMessage = ko.observable("");
    this.IsMatched = ko.computed(function () {
        return t.NewPassword().length ? t.NewPassword() == t.ConfirmNewPassword() : !1
    });
    this.ApplyChangePassword = function () {
        if (!t.IsMatched()) {
            t.ErrorMessage($("#Password-change-error").data("notmatch"));
            return
        }
        t.ErrorMessage("");
        n.authenticationState.ApplyChangePassword({
            baseUrl: n.baseUrl,
            data: {
                newPassword: t.NewPassword(),
                oldPassword: t.OldPassword()
            },
            errormessage: function (n) {
                t.ErrorMessage(n)
            }
        })
    }
        ;
    this.SkipChangePassword = function () {
        n.authenticationState.GotoReturnUrl(!1)
    }
}
    ;
Teleopti.SSO.Authentication.ForgotPasswordView = function (n) {
    this.Display = function (t) {
        var i = new Teleopti.SSO.Authentication.ForgotPasswordViewModel({
            baseUrl: Teleopti.SSO.Authentication.Settings.baseUrl
        });
        t.render(n.html);
        ko.cleanNode(t.element[0]);
        ko.applyBindings(i, t.element[0]);
        $("#user-name").focus()
    }
}
    ;
Teleopti.SSO.Authentication.ForgotPasswordViewModel = function (n) {
    function r(n) {
        var t = i("__RequestVerificationToken_MainWeb");
        t && (n.headers ? n.headers["X-XSRF-TOKEN"] = t : n.headers = {
            "X-XSRF-TOKEN": t
        })
    }
    var t = this, i;
    this.UserName = ko.observable("");
    this.ErrorMessage = ko.observable("");
    this.SuccessMessage = ko.observable("");
    this.baseUrl = n.baseUrl;
    i = function (n) {
        for (var r = n + "=", u = document.cookie.split(";"), t, i = 0; i < u.length; i++) {
            for (t = u[i]; t.charAt(0) === " ";)
                t = t.substring(1);
            if (t.indexOf(r) === 0)
                return t.substring(r.length, t.length)
        }
        return ""
    }
        ;
    this.SendForgotPasswordMail = function () {
        var n = {
            type: "POST",
            data: {
                UserIdentifier: t.UserName
            },
            url: t.baseUrl + "ChangePassword/RequestReset",
            success: function (n) {
                n.success === !0 ? t.ShowSuccessMessage() : (console.log(n),
                    t.ShowErrorMessage($("#Password-change-error").data("techerror")))
            },
            error: function (n) {
                console.log(n);
                t.ShowErrorMessage($("#Password-change-error").data("techerror"))
            }
        };
        r(n);
        $.ajax(n)
    }
        ;
    this.ShowErrorMessage = function (n) {
        t.ErrorMessage(n);
        t.SuccessMessage("")
    }
        ;
    this.ShowSuccessMessage = function () {
        t.ErrorMessage("");
        t.SuccessMessage("show")
    }
        ;
    this.BackToLogin = function () {
        Teleopti.SSO.Authentication.Navigation.GotoSignIn()
    }
        ;
    this.onEnterKey = function (n, i) {
        return i.keyCode === 13 && t.SendForgotPasswordMail(),
            !0
    }
}
    ;
Teleopti.SSO.Authentication.Init = function () {
    function n(n) {
        n.render = function (n) {
            $("#view").html(n)
        }
            ;
        n.element = $("#view");
        n.authenticationState = t;
        u[n.view].Display(n)
    }
    function f() {
        var t = "signin";
        crossroads.addRoute(new RegExp("^(" + t + ")$", "i"), function (t) {
            n({
                view: t
            })
        });
        crossroads.addRoute(new RegExp("^(changepassword)$", "i"), function () {
            n({
                view: "changepassword",
                mustChangePassword: !1
            })
        });
        crossroads.addRoute(new RegExp("^(mustchangepassword)$", "i"), function () {
            n({
                view: "changepassword",
                mustChangePassword: !0
            })
        });
        crossroads.addRoute(new RegExp("^(forgotpassword)$", "i"), function () {
            n({
                view: "forgotpassword"
            })
        });
        crossroads.addRoute(new RegExp("^(" + t + ")$", "i"), function (t) {
            n({
                view: t
            })
        });
        crossroads.addRoute("", function () {
            n({
                view: r
            })
        });
        crossroads.bypassed.add(function () {
            n({
                view: r
            })
        })
    }
    function e() {
        var n = function (n) {
            crossroads.parse(n)
        };
        hasher.initialized.add(n);
        hasher.changed.add(n);
        hasher.init()
    }
    var r = "signin"
        , i = function (n) {
            var t = $("#" + n)
                , i = t.html();
            return t.remove(),
                i
        }
        , t = new Teleopti.SSO.Authentication.AuthenticationState({
            baseUrl: Teleopti.SSO.Authentication.Settings.baseUrl
        })
        , u = {
            signin: new Teleopti.SSO.Authentication.SignInView({
                html: i("signin"),
                baseUrl: Teleopti.SSO.Authentication.Settings.baseUrl,
                authenticationState: t
            }),
            changepassword: new Teleopti.SSO.Authentication.ChangePasswordView({
                html: i("changepassword"),
                baseUrl: Teleopti.SSO.Authentication.Settings.baseUrl,
                authenticationState: t
            }),
            forgotpassword: new Teleopti.SSO.Authentication.ForgotPasswordView({
                html: i("forgotpassword"),
                baseUrl: Teleopti.SSO.Authentication.Settings.baseUrl,
                authenticationState: t
            })
        };
    f();
    e()
}
    ;
Teleopti.SSO.Authentication.JQueryAjaxViewModel = function () {
    var n = this, t;
    this.Count = ko.observable(0);
    this.Active = ko.observable(!1);
    this.Inactive = ko.computed(function () {
        return !n.Active()
    });
    t = $(document);
    t.ajaxStart(function () {
        n.Active(!0)
    });
    t.ajaxStop(function () {
        n.Active(!1)
    });
    t.ajaxSend(function () {
        n.Count(n.Count() + 1)
    });
    t.ajaxComplete(function () {
        n.Count(n.Count() - 1)
    })
}
    ;
Teleopti.SSO.Authentication.NavigationConstructor = function () {
    this.GotoChangePassword = function () {
        window.location.hash = "changepassword"
    }
        ;
    this.GotoMustChangePassword = function () {
        window.location.hash = "mustchangepassword"
    }
        ;
    this.GotoForgotPassword = function () {
        window.location.hash = "forgotpassword"
    }
        ;
    this.GotoReturnUrl = function (n, t, i) {
        function o(n) {
            var i = e("__RequestVerificationToken_MainWeb"), t;
            i && (t = $("<input><\/input>"),
                t.attr("type", "hidden"),
                t.attr("name", "X-XSRF-TOKEN"),
                t.attr("value", i),
                n.append(t))
        }
        var r = $("<form><\/form>"), u, f, e;
        r.attr("method", "post");
        r.attr("action", n);
        u = $("<input><\/input>");
        u.attr("type", "hidden");
        u.attr("name", "pendingRequest");
        u.attr("value", t);
        r.append(u);
        f = $("<input><\/input>");
        f.attr("type", "hidden");
        f.attr("name", "isPersistent");
        f.attr("value", i);
        r.append(f);
        e = function (n) {
            for (var r = n + "=", u = document.cookie.split(";"), t, i = 0; i < u.length; i++) {
                for (t = u[i]; t.charAt(0) === " ";)
                    t = t.substring(1);
                if (t.indexOf(r) === 0)
                    return t.substring(r.length, t.length)
            }
            return ""
        }
            ;
        o(r);
        $(document.body).append(r);
        r.submit()
    }
        ;
    this.GotoSignIn = function () {
        window.location.hash = ""
    }
}
    ;
Teleopti.SSO.Authentication.Navigation = new Teleopti.SSO.Authentication.NavigationConstructor;
Teleopti.SSO.Authentication.Settings = {
    baseUrl: "",
    returnUrl: "",
    pendingRequest: ""
};
Teleopti.SSO.Authentication.SignInView = function (n) {
    this.Display = function (t) {
        var i = new Teleopti.SSO.Authentication.SignInViewModel({
            baseUrl: n.baseUrl,
            authenticationState: n.authenticationState
        });
        t.render(n.html);
        ko.cleanNode(t.element[0]);
        ko.applyBindings(i, t.element[0]);
        $("#Username-input").focus()
    }
}
    ;
Teleopti.SSO.Authentication.SignInViewModel = function (n) {
    var t = this;
    this.UserName = ko.observable("");
    this.Password = ko.observable("");
    this.IsLogonFromBrowser = typeof isTeleoptiProvider == "undefined";
    this.RememberMe = ko.observable(!t.IsLogonFromBrowser);
    this.ErrorMessage = ko.observable();
    this.HasErrorMessage = ko.computed(function () {
        var n = t.ErrorMessage();
        return n && n.length > 0
    });
    this.Ajax = new Teleopti.SSO.Authentication.JQueryAjaxViewModel;
    this.gotoForgotPassword = function () {
        Teleopti.SSO.Authentication.Navigation.GotoForgotPassword()
    }
        ;
    this.isToggleEnabled = function (n) {
        var t = !1;
        return $.ajax({
            type: "GET",
            url: "../../api/ToggleHandler/IsEnabled?toggle=" + n,
            async: !1,
            success: function (n) {
                t = n.IsEnabled
            }
        }),
            t
    }
        ;
    this.SignIn = function () {
        var i = n.authenticationState;
        t.ErrorMessage("");
        i.TryToSignIn({
            data: {
                type: "application",
                username: t.UserName(),
                password: t.Password(),
                rememberMe: t.RememberMe(),
                IsLogonFromBrowser: t.IsLogonFromBrowser
            },
            errormessage: function (n) {
                t.ErrorMessage(n)
            }
        })
    }
}
    ;
Teleopti.SSO.Common = function (n) {
    function t() {
        window.console && window.console.log && window.console.log(Array.prototype.join.call(arguments, " "))
    }
    return {
        AjaxFailed: function (i, r, u) {
            n("#dialog-modal").attr("title", "Ajax error: " + u);
            n("#dialog-modal").dialog({
                width: 800,
                height: 500,
                position: "center",
                modal: !0,
                create: function () {
                    var t = i.responseText;
                    n(this).text(t)
                }
            });
            t("Method Failed" + i + r + u)
        },
        Log: function (n) {
            t(n)
        }
    }
}(jQuery)
