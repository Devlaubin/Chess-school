// Maintenance mode redirect.
// Remove the script tag referencing this file from HTML pages to disable maintenance mode.
(function () {
  const currentUrl = window.location.href;
  const redirectTarget = "maintenance.html";
  if (
    !currentUrl.endsWith(redirectTarget) &&
    currentUrl.indexOf(redirectTarget) === -1
  ) {
    window.location.replace(redirectTarget);
  }
})();
