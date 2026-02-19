/**
 * Trusted Types default policy - must load before any other scripts.
 * Required by CSP require-trusted-types-for 'script' directive.
 * Creates a default policy for DOM XSS sink compatibility.
 */
(function () {
  if (typeof window !== "undefined" && window.trustedTypes && window.trustedTypes.createPolicy) {
    try {
      window.trustedTypes.createPolicy("default", {
        createHTML: function (input) {
          return input;
        },
        createScript: function (input) {
          return input;
        },
        createScriptURL: function (input) {
          return input;
        },
      });
    } catch (_) {}
  }
})();
