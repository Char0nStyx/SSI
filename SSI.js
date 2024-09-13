/**
 * SSI
 * it is expected that this code is loaded dynamically in mods.
 * See modBase repo.
 * users are expected to implement the following function:
 * inject(inj)
 */

function runInjector() {
  const SSI_VERSION = 4;
  //SSI -> ShellShock injector
  console.log(`using SSI version ${SSI_VERSION}.`);
  let shellJs;
  const oldOpenFunc = XMLHttpRequest.prototype.open;
  const oldResponse = Object.getOwnPropertyDescriptor(
    XMLHttpRequest.prototype,
    "response",
  );
  XMLHttpRequest.prototype.open = function (...args) {
    if (args[1] && args[1].includes("js/shellshock.js")) {
      shellJs = this;
    }
    return oldOpenFunc.apply(this, args);
  };
  Object.defineProperty(XMLHttpRequest.prototype, "response", {
    get: function () {
      if (this == shellJs) {
        return injectInternal(oldResponse.get.call(this));
      }
      return oldResponse.get.call(this);
    },
  });

  const injectInternal = function (js) {
    const inj = function (o, n) {
      //NOTE! Due to some anti-cheat, using replaceAll for more than
      //200000 characters crashes the game.
      //If you need more than 200k chars, save the original replaceAll
      //prototype function at the start of the page and then run that.
      js = js.replaceAll(o, n);
    };
    //user-implemented function
    if (typeof inject === "function") inject(inj);
    return js;
  };
}
