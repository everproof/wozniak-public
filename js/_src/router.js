/**
 * Super simple JavaScript router
 */

/**
 * @param {String|Function} page
 * @param {Function} [callback]
 */
function route(page, callback) {
    if (typeof page === "function") {
        page();
    } else {
        if (window.location.pathname === page) {
            callback();
        }
    }
}
