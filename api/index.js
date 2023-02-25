var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
}, __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default")), __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// empty-module:~/libs/firebase.client
var require_firebase = __commonJS({
  "empty-module:~/libs/firebase.client"(exports, module2) {
    module2.exports = {};
  }
});

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  future: () => future,
  publicPath: () => publicPath,
  routes: () => routes
});
module.exports = __toCommonJS(stdin_exports);

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_server = require("react-dom/server"), import_remix = require("@mantine/remix"), import_react = require("@remix-run/react"), import_jsx_dev_runtime = require("react/jsx-dev-runtime"), server = (0, import_remix.createStylesServer)();
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let markup = (0, import_server.renderToString)(
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.RemixServer, { context: remixContext, url: request.url }, void 0, !1, {
      fileName: "app/entry.server.tsx",
      lineNumber: 17,
      columnNumber: 5
    }, this)
  );
  return responseHeaders.set("Content-Type", "text/html"), new Response(`<!DOCTYPE html>${(0, import_remix.injectStyles)(markup, server)}`, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  ErrorBoundary: () => ErrorBoundary,
  default: () => App,
  links: () => links,
  meta: () => meta
});
var import_core = require("@mantine/core"), import_remix2 = require("@mantine/remix"), import_react2 = require("@remix-run/react");

// app/theme.ts
var theme = {
  fontFamily: "Be Vietnam Pro, ui-sans-serif,system-ui,-apple-system",
  headings: {
    fontFamily: "Be Vietnam Pro, ui-sans-serif,system-ui,-apple-system"
  }
};

// app/root.tsx
var import_jsx_dev_runtime2 = require("react/jsx-dev-runtime"), meta = () => [
  {
    name: "viewport",
    content: "width=device-width,initial-scale=1,max-scale=1"
  }
], links = () => [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }];
function App() {
  return (0, import_core.createEmotionCache)({ key: "mantine" }), /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("html", { lang: "en", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("head", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_remix2.StylesPlaceholder, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 31,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("meta", { charSet: "utf-8" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 32,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("meta", { content: "width=device-width,initial-scale=1", name: "viewport" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 33,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Meta, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 34,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Links, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 35,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("link", { href: "https://fonts.googleapis.com", rel: "preconnect" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 36,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
        "link",
        {
          crossOrigin: "",
          href: "https://fonts.gstatic.com",
          rel: "preconnect"
        },
        void 0,
        !1,
        {
          fileName: "app/root.tsx",
          lineNumber: 37,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
        "link",
        {
          href: "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;1,200;1,300;1,400;1,500;1,600&display=swap",
          rel: "stylesheet"
        },
        void 0,
        !1,
        {
          fileName: "app/root.tsx",
          lineNumber: 42,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 30,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("body", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_core.MantineProvider, { withGlobalStyles: !0, withNormalizeCSS: !0, theme, children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Outlet, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 49,
        columnNumber: 11
      }, this) }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 48,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.ScrollRestoration, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 51,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Scripts, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 52,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.LiveReload, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 53,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 47,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 29,
    columnNumber: 5
  }, this);
}
function ErrorBoundary({ error }) {
  return console.error(error), /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("html", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("head", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("title", { children: "Oh no!" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 63,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Meta, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 64,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Links, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 65,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 62,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("body", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Scripts, {}, void 0, !1, {
      fileName: "app/root.tsx",
      lineNumber: 69,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/root.tsx",
      lineNumber: 67,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 61,
    columnNumber: 5
  }, this);
}

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  loader: () => loader
});
var import_node = require("@remix-run/node"), loader = () => (0, import_node.redirect)("/app");

// app/routes/about.tsx
var about_exports = {};
__export(about_exports, {
  default: () => About
});
var import_jsx_dev_runtime3 = require("react/jsx-dev-runtime");
function About() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { children: "About" }, void 0, !1, {
    fileName: "app/routes/about.tsx",
    lineNumber: 2,
    columnNumber: 10
  }, this);
}

// app/routes/app/index.tsx
var app_exports = {};
__export(app_exports, {
  default: () => App2,
  meta: () => meta2
});
var import_react4 = require("@remix-run/react");

// app/config/app-config.ts
var APP_NAME = "Th\xEDch L\xE0m M\u1ED9c";

// app/hooks/useAuth.ts
var import_react3 = require("react"), import_constate = __toESM(require("constate"));

// app/libs/appwrite.ts
var import_appwrite = require("appwrite"), awClient = new import_appwrite.Client().setEndpoint("https://brains.withDustin.com/v1").setProject("tlm-platform"), awAccount = new import_appwrite.Account(awClient);

// app/hooks/useAuth.ts
var useAuthHook = () => {
  let [isLoading, setIsLoading] = (0, import_react3.useState)(!1), [account, setAccount] = (0, import_react3.useState)(null);
  return (0, import_react3.useEffect)(() => {
    setIsLoading(!0), awAccount.get().then((account2) => {
      setAccount(account2), setIsLoading(!1);
    }).catch(() => window.location.href = "/auth"), awAccount.getSession("current").then(console.log);
  }, []), { account, isLoading };
}, [AuthProvider, useAuth] = (0, import_constate.default)(useAuthHook);

// app/routes/app/index.tsx
var import_jsx_dev_runtime4 = require("react/jsx-dev-runtime"), meta2 = () => [{ title: APP_NAME }];
function App2() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_react4.Outlet, {}, void 0, !1, {
    fileName: "app/routes/app/index.tsx",
    lineNumber: 12,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/app/index.tsx",
    lineNumber: 11,
    columnNumber: 5
  }, this);
}

// app/routes/app/_index/index.tsx
var index_exports2 = {};
__export(index_exports2, {
  default: () => AppIndex
});
var import_core2 = require("@mantine/core");
var import_jsx_dev_runtime5 = require("react/jsx-dev-runtime");
function AppIndex() {
  let { account, isLoading } = useAuth();
  return isLoading || !account ? /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(import_core2.Box, { sx: { height: "100vh", display: "grid", placeItems: "center" }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(import_core2.Loader, {}, void 0, !1, {
    fileName: "app/routes/app/_index/index.tsx",
    lineNumber: 11,
    columnNumber: 9
  }, this) }, void 0, !1, {
    fileName: "app/routes/app/_index/index.tsx",
    lineNumber: 10,
    columnNumber: 7
  }, this) : account == null ? void 0 : account.name;
}

// app/routes/app/user/index.tsx
var user_exports = {};
__export(user_exports, {
  default: () => User
});
function User() {
  return "123";
}

// app/routes/auth.tsx
var auth_exports = {};
__export(auth_exports, {
  default: () => AuthLayout,
  meta: () => meta3
});
var import_core3 = require("@mantine/core"), import_react5 = require("@remix-run/react");

// app/utils/meta.ts
var getTitle = (title) => title ? `${title} \u2013 ${APP_NAME}` : APP_NAME;

// app/routes/auth.tsx
var import_jsx_dev_runtime6 = require("react/jsx-dev-runtime"), meta3 = () => [{ title: getTitle("\u0110\u0103ng nh\u1EADp") }];
function AuthLayout() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(import_core3.Container, { py: 60, size: "xs", children: /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(import_core3.Stack, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(import_core3.Group, { align: "baseline", spacing: "lg", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(
        "a",
        {
          href: "https://storelammoc.vn",
          rel: "noreferrer",
          target: "_blank",
          title: "Store L\xE0m M\u1ED9c",
          children: /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(import_core3.Image, { height: 40, src: "/img/slm-logo.png", width: "auto" }, void 0, !1, {
            fileName: "app/routes/auth.tsx",
            lineNumber: 20,
            columnNumber: 13
          }, this)
        },
        void 0,
        !1,
        {
          fileName: "app/routes/auth.tsx",
          lineNumber: 14,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(
        "a",
        {
          href: "https://thichtulam.com",
          rel: "noreferrer",
          target: "_blank",
          title: "Th\xEDch T\u1EF1 L\xE0m",
          children: /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(import_core3.Image, { height: 40, src: "/img/ttl-logo.png", width: "auto" }, void 0, !1, {
            fileName: "app/routes/auth.tsx",
            lineNumber: 28,
            columnNumber: 13
          }, this)
        },
        void 0,
        !1,
        {
          fileName: "app/routes/auth.tsx",
          lineNumber: 22,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/auth.tsx",
      lineNumber: 13,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(import_core3.Box, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(import_core3.Title, { children: "\u0110\u0103ng nh\u1EADp" }, void 0, !1, {
        fileName: "app/routes/auth.tsx",
        lineNumber: 32,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(import_core3.Text, { color: "dimmed", children: "K\u1EBFt n\u1ED1i t\xE0i kho\u1EA3n Store L\xE0m M\u1ED9c v\xE0 Th\xEDch T\u1EF1 L\xE0m" }, void 0, !1, {
        fileName: "app/routes/auth.tsx",
        lineNumber: 33,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/auth.tsx",
      lineNumber: 31,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(import_react5.Outlet, {}, void 0, !1, {
      fileName: "app/routes/auth.tsx",
      lineNumber: 37,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/auth.tsx",
    lineNumber: 12,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/auth.tsx",
    lineNumber: 11,
    columnNumber: 5
  }, this);
}

// app/routes/auth._index.tsx
var auth_index_exports = {};
__export(auth_index_exports, {
  loader: () => loader2
});
var import_node2 = require("@remix-run/node"), loader2 = () => (0, import_node2.redirect)("./sign-in");

// app/routes/auth.sign-in._index.tsx
var auth_sign_in_index_exports = {};
__export(auth_sign_in_index_exports, {
  action: () => action,
  default: () => SignIn,
  meta: () => meta4
});
var import_react6 = require("react"), import_core4 = require("@mantine/core"), import_node3 = require("@remix-run/node"), import_react7 = require("@remix-run/react"), import_auth = require("firebase/auth"), import_firebase = __toESM(require_firebase());

// app/libs/prisma.server.ts
var import_client = require("@prisma/client"), import_debug = __toESM(require("debug")), prisma = new import_client.PrismaClient();
var prisma_server_default = prisma;

// app/utils/account.ts
var normalizePhoneNumber = (phone) => `+${phone.replace(/\D/g, "").replace(/^0/, "84")}`;

// app/utils/forms.ts
var getFormData = async (request) => Object.fromEntries(await request.formData());

// app/routes/auth.sign-in._index.tsx
var import_jsx_dev_runtime7 = require("react/jsx-dev-runtime"), meta4 = () => [{ title: getTitle("\u0110\u0103ng nh\u1EADp") }];
async function action({ request }) {
  let { phone } = await getFormData(request);
  if (!phone.match(/^0\d{9}$/))
    return (0, import_node3.json)(
      {
        success: !1,
        errorMessage: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i kh\xF4ng h\u1EE3p l\u1EC7.",
        phone
      },
      { status: 400 }
    );
  phone = normalizePhoneNumber(phone);
  let accountByPhone = await prisma_server_default.account.findFirst({ where: { phone } });
  return accountByPhone && accountByPhone.password && accountByPhone.phoneVerified ? (0, import_node3.redirect)(`./password?phone=${phone}&accountId=${accountByPhone.id}`) : await prisma_server_default.customer.findFirst({
    where: { phone: { has: phone } }
  }) ? (0, import_node3.json)({
    success: !0,
    errorMessage: null,
    phone
  }) : (0, import_node3.json)(
    {
      success: !1,
      errorMessage: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i n\xE0y ch\u01B0a c\xF3 \u0111\u01A1n h\xE0ng trong h\u1EC7 th\u1ED1ng.",
      phone
    },
    { status: 404 }
  );
}
function SignIn() {
  let navigate = (0, import_react7.useNavigate)(), transition = (0, import_react7.useTransition)(), actionData = (0, import_react7.useActionData)(), recaptchaVerifierRef = (0, import_react6.useRef)(), authRef = (0, import_react6.useRef)(), [isAuthenticating, setIsAuthenticating] = (0, import_react6.useState)(!1), [phone, setPhone] = (0, import_react6.useState)(""), [errorMessage, setErrorMessage] = (0, import_react6.useState)(
    (actionData == null ? void 0 : actionData.errorMessage) ?? null
  ), phoneRef = (0, import_react6.useRef)(null);
  console.log(transition, actionData);
  let isSubmitting = (0, import_react6.useMemo)(
    () => transition.type !== "idle" || isAuthenticating,
    [isAuthenticating, transition.type]
  ), handlePhoneChange = (0, import_react6.useCallback)(
    (event) => {
      setPhone(event.target.value), setErrorMessage(null);
    },
    []
  ), handleSendSms = (0, import_react6.useCallback)(
    async (phoneNumber) => {
      let auth = authRef.current, verifier = recaptchaVerifierRef.current;
      if (!!(auth && verifier)) {
        setIsAuthenticating(!0);
        try {
          let result = await (0, import_auth.signInWithPhoneNumber)(
            auth,
            phoneNumber.replace(/^0/, "+84"),
            verifier
          );
          result && navigate(
            `./onboard?phone=${phoneNumber}&verificationId=${result.verificationId}`
          );
        } catch (err) {
          console.error(err), setErrorMessage("Kh\xF4ng th\u1EC3 g\u1EEDi OTP. Vui l\xF2ng th\u1EED l\u1EA1i.");
        }
        setIsAuthenticating(!1);
      }
    },
    [navigate]
  );
  return (0, import_react6.useEffect)(() => {
    var _a;
    setErrorMessage((actionData == null ? void 0 : actionData.errorMessage) ?? null), actionData != null && actionData.errorMessage && ((_a = phoneRef.current) == null || _a.focus());
  }, [actionData == null ? void 0 : actionData.errorMessage]), (0, import_react6.useEffect)(() => {
    actionData != null && actionData.success && handleSendSms(actionData.phone);
  }, [actionData == null ? void 0 : actionData.success, handleSendSms, actionData == null ? void 0 : actionData.phone]), (0, import_react6.useEffect)(() => {
    setTimeout(() => {
      authRef.current = (0, import_auth.getAuth)(import_firebase.firebaseClient), authRef.current.useDeviceLanguage(), recaptchaVerifierRef.current = new import_auth.RecaptchaVerifier(
        "sign-in-button",
        {
          size: "invisible",
          callback: () => {
          }
        },
        authRef == null ? void 0 : authRef.current
      );
    }, 100);
  }, []), /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(import_react7.Form, { method: "post", children: /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(import_core4.Stack, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(
      import_core4.TextInput,
      {
        autoFocus: !0,
        required: !0,
        disabled: isSubmitting,
        id: "phone",
        label: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i",
        name: "phone",
        onChange: handlePhoneChange,
        placeholder: "Nh\u1EADp S\u0110T mua h\xE0ng",
        ref: phoneRef,
        value: phone
      },
      void 0,
      !1,
      {
        fileName: "app/routes/auth.sign-in._index.tsx",
        lineNumber: 177,
        columnNumber: 9
      },
      this
    ),
    errorMessage && /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(import_core4.Alert, { color: "red", children: errorMessage }, void 0, !1, {
      fileName: "app/routes/auth.sign-in._index.tsx",
      lineNumber: 190,
      columnNumber: 26
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(import_core4.Box, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(
      import_core4.Button,
      {
        disabled: !!errorMessage,
        id: "sign-in-button",
        loading: isSubmitting,
        type: "submit",
        children: "Ti\u1EBFp t\u1EE5c"
      },
      void 0,
      !1,
      {
        fileName: "app/routes/auth.sign-in._index.tsx",
        lineNumber: 193,
        columnNumber: 11
      },
      this
    ) }, void 0, !1, {
      fileName: "app/routes/auth.sign-in._index.tsx",
      lineNumber: 192,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/auth.sign-in._index.tsx",
    lineNumber: 176,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/auth.sign-in._index.tsx",
    lineNumber: 175,
    columnNumber: 5
  }, this);
}

// app/routes/auth.sign-in.onboard.tsx
var auth_sign_in_onboard_exports = {};
__export(auth_sign_in_onboard_exports, {
  action: () => action2,
  default: () => AuthSignInOnboard,
  loader: () => loader3
});
var import_react9 = require("react"), import_core6 = require("@mantine/core"), import_node4 = require("@remix-run/node"), import_react10 = require("@remix-run/react"), import_auth2 = require("firebase/auth");

// app/components/locked-auth-phone.tsx
var import_core5 = require("@mantine/core"), import_react8 = require("@remix-run/react"), import_icons_react = require("@tabler/icons-react"), import_jsx_dev_runtime8 = require("react/jsx-dev-runtime");
function LockedAuthPhoneInput({
  phone,
  editTo
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
    import_core5.TextInput,
    {
      autoFocus: !0,
      disabled: !0,
      required: !0,
      id: "phone",
      label: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i",
      name: "phone",
      placeholder: "Nh\u1EADp S\u0110T mua h\xE0ng",
      value: phone,
      rightSection: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
        import_core5.ActionIcon,
        {
          component: import_react8.Link,
          sx: { height: 26, width: 26 },
          to: editTo,
          variant: "light",
          children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(import_icons_react.IconPencil, { size: 16 }, void 0, !1, {
            fileName: "app/components/locked-auth-phone.tsx",
            lineNumber: 29,
            columnNumber: 11
          }, this)
        },
        void 0,
        !1,
        {
          fileName: "app/components/locked-auth-phone.tsx",
          lineNumber: 23,
          columnNumber: 9
        },
        this
      )
    },
    void 0,
    !1,
    {
      fileName: "app/components/locked-auth-phone.tsx",
      lineNumber: 13,
      columnNumber: 5
    },
    this
  );
}

// app/routes/auth.sign-in.onboard.tsx
var import_firebase2 = __toESM(require_firebase()), import_jsx_dev_runtime9 = require("react/jsx-dev-runtime");
function action2() {
  return {};
}
var loader3 = async ({ request }) => {
  let url = new URL(request.url), phone = url.searchParams.get("phone"), verificationId = url.searchParams.get("verificationId");
  return phone && verificationId ? { phone } : (0, import_node4.redirect)("..");
};
function AuthSignInOnboard() {
  let navigate = (0, import_react10.useNavigate)(), location = (0, import_react10.useLocation)(), [searchParams] = (0, import_react10.useSearchParams)(), submit = (0, import_react10.useSubmit)(), phone = searchParams.get("phone"), verificationId = searchParams.get("verificationId"), [errorMessage, setErrorMessage] = (0, import_react9.useState)(""), [isLoading, setIsLoading] = (0, import_react9.useState)(!1), handleVerifyOtp = (0, import_react9.useCallback)(
    async (event) => {
      var _a;
      event.preventDefault();
      let otp = (_a = event.target.otp) == null ? void 0 : _a.value;
      if (!!otp) {
        setIsLoading(!0);
        try {
          let auth = (0, import_auth2.getAuth)(import_firebase2.firebaseClient), authCredential = import_auth2.PhoneAuthProvider.credential(verificationId, otp), userCredential = await (0, import_auth2.signInWithCredential)(auth, authCredential);
          navigate(
            `./password?token=${await userCredential.user.getIdToken()}&phone=${phone}&verificationId=${verificationId}`,
            { replace: !0 }
          );
        } catch (error) {
          console.error(error), setIsLoading(!1), setErrorMessage("Kh\xF4ng th\u1EC3 x\xE1c th\u1EF1c m\xE3 OTP");
        }
        setIsLoading(!1);
      }
    },
    [navigate, phone, verificationId]
  ), handleSubmit = (0, import_react9.useCallback)(
    async (event) => {
      var _a;
      if ((_a = event.target.otp) == null ? void 0 : _a.value)
        return handleVerifyOtp(event);
      event.preventDefault(), submit(event.currentTarget, {
        relative: "path",
        action: `${location.pathname}${location.search}`
      });
    },
    [handleVerifyOtp, location.pathname, location.search, submit]
  );
  return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(import_react10.Form, { method: "post", onSubmit: handleSubmit, children: /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(import_core6.Stack, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(LockedAuthPhoneInput, { editTo: "..", phone: phone ?? "" }, void 0, !1, {
      fileName: "app/routes/auth.sign-in.onboard.tsx",
      lineNumber: 98,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(import_react10.Outlet, { context: { isLoading, errorMessage } }, void 0, !1, {
      fileName: "app/routes/auth.sign-in.onboard.tsx",
      lineNumber: 99,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/auth.sign-in.onboard.tsx",
    lineNumber: 97,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/auth.sign-in.onboard.tsx",
    lineNumber: 96,
    columnNumber: 5
  }, this);
}

// app/routes/auth.sign-in.onboard._index.tsx
var auth_sign_in_onboard_index_exports = {};
__export(auth_sign_in_onboard_index_exports, {
  default: () => AuthSignInOnboardOTP
});
var import_core7 = require("@mantine/core"), import_react11 = require("@remix-run/react"), import_jsx_dev_runtime10 = require("react/jsx-dev-runtime");
function AuthSignInOnboardOTP() {
  let { errorMessage, isLoading = !1 } = (0, import_react11.useOutletContext)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(import_jsx_dev_runtime10.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(import_core7.Alert, { children: "T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n ch\u01B0a \u0111\u01B0\u1EE3c thi\u1EBFt l\u1EADp. Vui l\xF2ng x\xE1c nh\u1EADn s\u1ED1 \u0111i\u1EC7n tho\u1EA1i \u0111\u1EC3 ti\u1EBFp t\u1EE5c." }, void 0, !1, {
      fileName: "app/routes/auth.sign-in.onboard._index.tsx",
      lineNumber: 12,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(
      import_core7.TextInput,
      {
        autoFocus: !0,
        required: !0,
        disabled: isLoading,
        label: "M\xE3 x\xE1c th\u1EF1c",
        name: "otp",
        placeholder: "Nh\u1EADp m\xE3 OTP \u0111\xE3 g\u1EEDi \u0111\u1EBFn S\u0110T c\u1EE7a b\u1EA1n"
      },
      void 0,
      !1,
      {
        fileName: "app/routes/auth.sign-in.onboard._index.tsx",
        lineNumber: 17,
        columnNumber: 7
      },
      this
    ),
    errorMessage && /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(import_core7.Alert, { color: "red", children: errorMessage }, void 0, !1, {
      fileName: "app/routes/auth.sign-in.onboard._index.tsx",
      lineNumber: 26,
      columnNumber: 24
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(import_core7.Group, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(import_core7.Button, { loading: isLoading, type: "submit", children: "Ti\u1EBFp t\u1EE5c" }, void 0, !1, {
        fileName: "app/routes/auth.sign-in.onboard._index.tsx",
        lineNumber: 29,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(import_core7.Button, { disabled: !0, color: "dark", type: "button", variant: "default", children: "G\u1EEDi l\u1EA1i" }, void 0, !1, {
        fileName: "app/routes/auth.sign-in.onboard._index.tsx",
        lineNumber: 32,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/auth.sign-in.onboard._index.tsx",
      lineNumber: 28,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/auth.sign-in.onboard._index.tsx",
    lineNumber: 11,
    columnNumber: 5
  }, this);
}

// app/routes/auth.sign-in.onboard.password.tsx
var auth_sign_in_onboard_password_exports = {};
__export(auth_sign_in_onboard_password_exports, {
  action: () => action3,
  default: () => AuthSignInOnboardPassword
});
var import_react12 = require("react"), import_core8 = require("@mantine/core"), import_node6 = require("@remix-run/node"), import_react13 = require("@remix-run/react");

// app/config/messages.ts
var UNABLE_TO_SET_PASSWORD = "Kh\xF4ng th\u1EC3 c\u1EADp nh\u1EADt m\u1EADt kh\u1EA9u. Vui l\xF2ng th\u1EED l\u1EA1i.", INVALID_PASSWORD_LENGTH = "M\u1EADt kh\u1EA9u ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 8 k\xFD t\u1EF1.", INVALID_AUTH_CREDENTIALS = "Th\xF4ng tin \u0111\u0103ng nh\u1EADp kh\xF4ng \u0111\xFAng.";
var CUSTOMER_NOT_FOUND = "Kh\xF4ng th\u1EC3 t\xECm th\u1EA5y th\xF4ng tin kh\xE1ch h\xE0ng";

// app/libs/bcrypt.server.ts
var bcrypt_server_exports = {};
__reExport(bcrypt_server_exports, require("bcrypt"));

// app/libs/firebase.server.ts
var import_firebase_admin = __toESM(require("firebase-admin"));
import_firebase_admin.default.apps.length || import_firebase_admin.default.initializeApp({
  credential: import_firebase_admin.default.credential.cert({
    project_id: "tlm-customer-portal",
    private_key_id: "54c0da645bacb30d25cc125a7ff17560c73cd3c6",
    private_key: process.env.FIREBASE_PRIVATE,
    client_email: "firebase-adminsdk-kgrcg@tlm-customer-portal.iam.gserviceaccount.com",
    client_id: "114829270815542477101",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-kgrcg%40tlm-customer-portal.iam.gserviceaccount.com"
  })
});
var firebaseAdmin = import_firebase_admin.default;

// app/utils/session.server.ts
var import_node5 = require("@remix-run/node"), import_bcrypt = require("bcrypt");
async function signIn({
  phone,
  password
}) {
  let account = await prisma_server_default.account.findUnique({ where: { phone } });
  return !account || !await (0, import_bcrypt.compareSync)(password, account.password) ? null : { id: account.id };
}
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret)
  throw new Error("SESSION_SECRET must be set");
var storage = (0, import_node5.createCookieSessionStorage)({
  cookie: {
    name: "RJ_session",
    secure: !1,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: !0
  }
});
async function createUserSession(accountId, redirectTo) {
  let session = await storage.getSession();
  return session.set("accountId", accountId), (0, import_node5.redirect)(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session)
    }
  });
}

// app/routes/auth.sign-in.onboard.password.tsx
var import_jsx_dev_runtime11 = require("react/jsx-dev-runtime");
async function action3({ request }) {
  let url = new URL(request.url), phone = url.searchParams.get("phone"), token = url.searchParams.get("token"), { password } = await getFormData(request);
  if (!(phone && token && password))
    return (0, import_node6.json)(
      {
        success: !1,
        errorMessage: UNABLE_TO_SET_PASSWORD
      },
      { status: 400 }
    );
  if (((password == null ? void 0 : password.length) ?? 0) < 8)
    return (0, import_node6.json)(
      {
        success: !1,
        errorMessage: INVALID_PASSWORD_LENGTH
      },
      { status: 400 }
    );
  try {
    let decoded = await firebaseAdmin.auth().verifyIdToken(token);
    if (!decoded.phone_number)
      return (0, import_node6.json)(
        { success: !1, errorMessage: UNABLE_TO_SET_PASSWORD },
        { status: 500 }
      );
    if (normalizePhoneNumber(phone) !== normalizePhoneNumber(decoded.phone_number))
      return (0, import_node6.json)(
        { success: !1, errorMessage: UNABLE_TO_SET_PASSWORD },
        { status: 400 }
      );
    let hashedPassword = (0, bcrypt_server_exports.hashSync)(password, 10), normalizedPhone = normalizePhoneNumber(phone), customer = await prisma_server_default.customer.findFirst({
      where: { phone: { has: normalizedPhone } }
    });
    if (!customer)
      return (0, import_node6.json)(
        { success: !1, errorMessage: CUSTOMER_NOT_FOUND },
        { status: 404 }
      );
    let account = await prisma_server_default.account.findFirst({
      where: { phone: normalizedPhone }
    });
    return account ? account = await prisma_server_default.account.update({
      where: { id: account.id },
      data: {
        password: hashedPassword,
        phoneVerified: !0,
        customerId: customer.id
      }
    }) : account = await prisma_server_default.account.create({
      data: {
        name: customer.name,
        password: hashedPassword,
        customerId: customer.id,
        lastLoggedIn: new Date(),
        phone: normalizedPhone,
        phoneVerified: !0
      }
    }), createUserSession(account.id, "/app");
  } catch (error) {
    return console.error(error), (0, import_node6.json)(
      { success: !1, errorMessage: UNABLE_TO_SET_PASSWORD },
      { status: 500 }
    );
  }
}
function AuthSignInOnboardPassword() {
  let { errorMessage } = (0, import_react13.useActionData)() ?? {}, transition = (0, import_react13.useTransition)(), passwordRef = (0, import_react12.useRef)(null), isLoading = transition.type !== "idle";
  return (0, import_react12.useEffect)(() => {
    errorMessage && setTimeout(() => {
      var _a;
      return (_a = passwordRef.current) == null ? void 0 : _a.focus();
    }, 100);
  }, [errorMessage]), /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(import_jsx_dev_runtime11.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(import_core8.Alert, { children: "H\xE3y thi\u1EBFt l\u1EADp m\u1EADt kh\u1EA9u \u0111\u1EC3 thu\u1EADn ti\u1EC7n cho c\xE1c l\u1EA7n \u0111\u0103ng nh\u1EADp sau." }, void 0, !1, {
      fileName: "app/routes/auth.sign-in.onboard.password.tsx",
      lineNumber: 134,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(
      import_core8.PasswordInput,
      {
        autoFocus: !0,
        required: !0,
        disabled: isLoading,
        label: "M\u1EADt kh\u1EA9u",
        name: "password",
        placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022",
        ref: passwordRef
      },
      void 0,
      !1,
      {
        fileName: "app/routes/auth.sign-in.onboard.password.tsx",
        lineNumber: 138,
        columnNumber: 7
      },
      this
    ),
    errorMessage && /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(import_core8.Alert, { color: "red", children: errorMessage }, void 0, !1, {
      fileName: "app/routes/auth.sign-in.onboard.password.tsx",
      lineNumber: 148,
      columnNumber: 24
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(import_core8.Group, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(import_core8.Button, { loading: isLoading, type: "submit", children: "L\u01B0u m\u1EADt kh\u1EA9u" }, void 0, !1, {
        fileName: "app/routes/auth.sign-in.onboard.password.tsx",
        lineNumber: 151,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(import_core8.Button, { disabled: !0, color: "dark", type: "button", variant: "default", children: "B\u1ECF qua" }, void 0, !1, {
        fileName: "app/routes/auth.sign-in.onboard.password.tsx",
        lineNumber: 154,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/auth.sign-in.onboard.password.tsx",
      lineNumber: 150,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/auth.sign-in.onboard.password.tsx",
    lineNumber: 133,
    columnNumber: 5
  }, this);
}

// app/routes/auth.sign-in.password.tsx
var auth_sign_in_password_exports = {};
__export(auth_sign_in_password_exports, {
  action: () => action4,
  default: () => AuthSignInPassword,
  loader: () => loader4
});
var import_core9 = require("@mantine/core"), import_node7 = require("@remix-run/node"), import_react14 = require("@remix-run/react");
var import_jsx_dev_runtime12 = require("react/jsx-dev-runtime"), loader4 = async ({ request }) => {
  let phone = new URL(request.url).searchParams.get("phone");
  return phone ? { phone } : (0, import_node7.redirect)("..");
};
async function action4({ request }) {
  let { phone, password } = await getFormData(request);
  if (!(phone && password))
    return (0, import_node7.json)({ errorMessage: INVALID_AUTH_CREDENTIALS }, { status: 400 });
  let account = await signIn({ phone: normalizePhoneNumber(phone), password });
  return account ? createUserSession(account.id, "/app") : (0, import_node7.json)({ errorMessage: INVALID_AUTH_CREDENTIALS }, { status: 400 });
}
function AuthSignInPassword() {
  let actionData = (0, import_react14.useActionData)(), { state } = (0, import_react14.useTransition)(), [searchParams] = (0, import_react14.useSearchParams)(), phone = searchParams.get("phone"), isSubmitting = state === "submitting";
  return /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(import_react14.Form, { method: "post", children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(import_core9.Stack, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(LockedAuthPhoneInput, { editTo: "..", phone }, void 0, !1, {
      fileName: "app/routes/auth.sign-in.password.tsx",
      lineNumber: 69,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("input", { hidden: !0, readOnly: !0, name: "phone", value: phone }, void 0, !1, {
      fileName: "app/routes/auth.sign-in.password.tsx",
      lineNumber: 70,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(
      import_core9.PasswordInput,
      {
        autoFocus: !0,
        required: !0,
        disabled: isSubmitting,
        label: "M\u1EADt kh\u1EA9u",
        name: "password",
        placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
      },
      void 0,
      !1,
      {
        fileName: "app/routes/auth.sign-in.password.tsx",
        lineNumber: 71,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(import_core9.Checkbox, { label: "Ghi nh\u1EDB \u0111\u0103ng nh\u1EADp", name: "rememberLogin" }, void 0, !1, {
      fileName: "app/routes/auth.sign-in.password.tsx",
      lineNumber: 79,
      columnNumber: 9
    }, this),
    (actionData == null ? void 0 : actionData.errorMessage) && /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(import_core9.Alert, { color: "red", children: actionData.errorMessage }, void 0, !1, {
      fileName: "app/routes/auth.sign-in.password.tsx",
      lineNumber: 81,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(import_core9.Box, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(import_core9.Button, { loading: isSubmitting, type: "submit", children: "\u0110\u0103ng nh\u1EADp" }, void 0, !1, {
      fileName: "app/routes/auth.sign-in.password.tsx",
      lineNumber: 84,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/routes/auth.sign-in.password.tsx",
      lineNumber: 83,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/auth.sign-in.password.tsx",
    lineNumber: 68,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/auth.sign-in.password.tsx",
    lineNumber: 67,
    columnNumber: 5
  }, this);
}

// app/routes/auth.verify.tsx
var auth_verify_exports = {};
__export(auth_verify_exports, {
  default: () => VerifyToken,
  loader: () => loader5
});
var import_core10 = require("@mantine/core"), import_jsx_dev_runtime13 = require("react/jsx-dev-runtime");
async function loader5({ request }) {
  return null;
}
function VerifyToken() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)(import_core10.Box, { sx: { textAlign: "center" }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)(import_core10.Loader, {}, void 0, !1, {
    fileName: "app/routes/auth.verify.tsx",
    lineNumber: 46,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/auth.verify.tsx",
    lineNumber: 45,
    columnNumber: 5
  }, this);
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { version: "5ed3396c", entry: { module: "/build/entry.client-5ZBIOR7M.js", imports: ["/build/_shared/chunk-OEMKKXRM.js", "/build/_shared/chunk-JK2J5KJC.js", "/build/_shared/chunk-RQFEN56L.js", "/build/_shared/chunk-VIPVJV6J.js", "/build/_shared/chunk-5KL4PAQL.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-42KLWAW6.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !0 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-FD5GBRGY.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/about": { id: "routes/about", parentId: "root", path: "about", index: void 0, caseSensitive: void 0, module: "/build/routes/about-5LWV4GCJ.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/app": { id: "routes/app", parentId: "root", path: "app", index: void 0, caseSensitive: void 0, module: "/build/routes/app-BWHZWKAT.js", imports: ["/build/_shared/chunk-AJ6CB5Z3.js", "/build/_shared/chunk-EJTMMG3N.js"], hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/app/_index": { id: "routes/app/_index", parentId: "routes/app", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/app/_index-RITZGN3Q.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/app/user": { id: "routes/app/user", parentId: "routes/app", path: "user", index: void 0, caseSensitive: void 0, module: "/build/routes/app/user-TYGK5LKV.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/auth": { id: "routes/auth", parentId: "root", path: "auth", index: void 0, caseSensitive: void 0, module: "/build/routes/auth-OW6MJMCM.js", imports: ["/build/_shared/chunk-DMULDC2W.js", "/build/_shared/chunk-EJTMMG3N.js"], hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/auth._index": { id: "routes/auth._index", parentId: "routes/auth", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/auth._index-GKPGSVA5.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/auth.sign-in._index": { id: "routes/auth.sign-in._index", parentId: "routes/auth", path: "sign-in", index: !0, caseSensitive: void 0, module: "/build/routes/auth.sign-in._index-LZVLFSWU.js", imports: ["/build/_shared/chunk-SOJZ3V3V.js", "/build/_shared/chunk-W4EJMWRT.js"], hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/auth.sign-in.onboard": { id: "routes/auth.sign-in.onboard", parentId: "routes/auth", path: "sign-in/onboard", index: void 0, caseSensitive: void 0, module: "/build/routes/auth.sign-in.onboard-MIMOPSLI.js", imports: ["/build/_shared/chunk-SOJZ3V3V.js", "/build/_shared/chunk-4BHUUGM6.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/auth.sign-in.onboard._index": { id: "routes/auth.sign-in.onboard._index", parentId: "routes/auth.sign-in.onboard", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/auth.sign-in.onboard._index-FXVVEVYT.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/auth.sign-in.onboard.password": { id: "routes/auth.sign-in.onboard.password", parentId: "routes/auth.sign-in.onboard", path: "password", index: void 0, caseSensitive: void 0, module: "/build/routes/auth.sign-in.onboard.password-5T5H3O5I.js", imports: ["/build/_shared/chunk-W4EJMWRT.js", "/build/_shared/chunk-65B4HZGS.js", "/build/_shared/chunk-EJTMMG3N.js"], hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/auth.sign-in.password": { id: "routes/auth.sign-in.password", parentId: "routes/auth", path: "sign-in/password", index: void 0, caseSensitive: void 0, module: "/build/routes/auth.sign-in.password-YJCYXMN5.js", imports: ["/build/_shared/chunk-4BHUUGM6.js", "/build/_shared/chunk-65B4HZGS.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/auth.verify": { id: "routes/auth.verify", parentId: "routes/auth", path: "verify", index: void 0, caseSensitive: void 0, module: "/build/routes/auth.verify-SJKNC6H5.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, cssBundleHref: void 0, url: "/build/manifest-5ED3396C.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public/build", future = { unstable_cssModules: !1, unstable_cssSideEffectImports: !1, unstable_dev: !1, unstable_postcss: !1, unstable_tailwind: !1, unstable_vanillaExtract: !1, v2_errorBoundary: !1, v2_meta: !0, v2_routeConvention: !0 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  },
  "routes/about": {
    id: "routes/about",
    parentId: "root",
    path: "about",
    index: void 0,
    caseSensitive: void 0,
    module: about_exports
  },
  "routes/app": {
    id: "routes/app",
    parentId: "root",
    path: "app",
    index: void 0,
    caseSensitive: void 0,
    module: app_exports
  },
  "routes/app/_index": {
    id: "routes/app/_index",
    parentId: "routes/app",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports2
  },
  "routes/app/user": {
    id: "routes/app/user",
    parentId: "routes/app",
    path: "user",
    index: void 0,
    caseSensitive: void 0,
    module: user_exports
  },
  "routes/auth": {
    id: "routes/auth",
    parentId: "root",
    path: "auth",
    index: void 0,
    caseSensitive: void 0,
    module: auth_exports
  },
  "routes/auth._index": {
    id: "routes/auth._index",
    parentId: "routes/auth",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: auth_index_exports
  },
  "routes/auth.sign-in._index": {
    id: "routes/auth.sign-in._index",
    parentId: "routes/auth",
    path: "sign-in",
    index: !0,
    caseSensitive: void 0,
    module: auth_sign_in_index_exports
  },
  "routes/auth.sign-in.onboard": {
    id: "routes/auth.sign-in.onboard",
    parentId: "routes/auth",
    path: "sign-in/onboard",
    index: void 0,
    caseSensitive: void 0,
    module: auth_sign_in_onboard_exports
  },
  "routes/auth.sign-in.onboard._index": {
    id: "routes/auth.sign-in.onboard._index",
    parentId: "routes/auth.sign-in.onboard",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: auth_sign_in_onboard_index_exports
  },
  "routes/auth.sign-in.onboard.password": {
    id: "routes/auth.sign-in.onboard.password",
    parentId: "routes/auth.sign-in.onboard",
    path: "password",
    index: void 0,
    caseSensitive: void 0,
    module: auth_sign_in_onboard_password_exports
  },
  "routes/auth.sign-in.password": {
    id: "routes/auth.sign-in.password",
    parentId: "routes/auth",
    path: "sign-in/password",
    index: void 0,
    caseSensitive: void 0,
    module: auth_sign_in_password_exports
  },
  "routes/auth.verify": {
    id: "routes/auth.verify",
    parentId: "routes/auth",
    path: "verify",
    index: void 0,
    caseSensitive: void 0,
    module: auth_verify_exports
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  assetsBuildDirectory,
  entry,
  future,
  publicPath,
  routes
});
//# sourceMappingURL=index.js.map
