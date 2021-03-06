lesson3:
	mocha test/app_spec.js -R spec 

lesson4_m: appUse_m callMiddleware_m errorHandler_m appEmbed_m
appUse_m:
	mocha test/app_spec.js -R spec -g 'Implement app.use'
callMiddleware_m:
	mocha test/app_spec.js -R spec -g 'Implement calling the middlewares'
errorHandler_m:
	mocha test/app_spec.js -R spec -g 'Implement Error Handling'
appEmbed_m:
	mocha test/app_spec.js -R spec -g 'Implement App Embedding As Middleware'

lesson4_t: appUse_t callMiddleware_t errorHandler_t appEmbed_t
appUse_t:
	mocha verify/app_spec.js -R spec -g 'Implement app.use'
callMiddleware_t:
	mocha verify/app_spec.js -R spec -g 'Implement calling the middlewares'
errorHandler_t:
	mocha verify/app_spec.js -R spec -g 'Implement Error Handling'
appEmbed_t:
	mocha verify/app_spec.js -R spec -g 'Implement App Embedding As Middleware'

lesson5_m: layerClass_m addLayer_m matchPath_m
layerClass_m:
	mocha test/app_spec.js -R spec -g 'Layer class and the match method'
addLayer_m:
	mocha test -R spec -g 'app.use should add a Layer to stack'
matchPath_m:
	mocha test -R spec -g 'The middlewares called should match request path'

lesson5_t: layerClass_t addLayer_t matchPath_t errorHandlerMatch_t
layerClass_t:
	mocha verify/app_spec.js -R spec -g 'Layer class and the match method'
addLayer_t:
	mocha verify -R spec -g 'app.use should add a Layer to stack'
matchPath_t:
	mocha verify -R spec -g 'The middlewares called should match request path:'
errorHandlerMatch_t:
	mocha verify -R spec -g 'The error handlers called should match request path:'

lesson6_t: pathParameters_t reqParams_t handleMethod_t prefix_t
pathParameters_t:
	mocha verify -R spec -g 'Path parameters extraction'
reqParams_t:
	mocha verify -R spec -g "Implement req.params"
handleMethod_t:
	mocha verify -R spec -g "app should have the handle method"
prefix_t:
	mocha verify -R spec -g "Prefix path trimming"

lesson7_t:
	mocha verify -R spec -g "App get method"
	mocha verify/verbs_spec.js -R spec -g "All http verbs"

.PHONY: lesson4_t lesson4_m lesson5_t lesson5_m lesson6_t

lesson8_t:
	mocha verify/route_spec.js -R spec -g "Add handlers to a route"
	mocha verify/route_spec.js -R spec -g "calling next"
	mocha verify/route_spec.js -R spec -g "error handling"
	mocha verify/route_spec.js -R spec -g "verb matching"
	mocha verify/route_spec.js -R spec -g "match any verb"
	mocha verify/route_spec.js -R spec -g "calling next\(route\)"
	mocha verify/route_spec.js -R spec -g "Implement Verbs For Route"
	mocha verify/route_spec.js -R spec -g "Implement app.route"
	mocha verify/route_spec.js -R spec -g "Implement Verbs For App"

lesson9_t:
	mocha verify/di_spec.js -R spec -g "app.factory"
	mocha verify/di_spec.js -R spec -g "Handler Dependencies Analysis"
	mocha verify/di_spec.js -R spec -g "load named dependencies"
	mocha verify/di_spec.js -R spec -g "dependencies error handling"
	mocha verify/di_spec.js -R spec -g "load bulitin dependencies"
	mocha verify/di_spec.js -R spec -g "pass req and res to factories"
	mocha verify/di_spec.js -R spec -g "Implement Injector Invokation"
	mocha verify/di_spec.js -R spec -g "Implement app.inject"

lesson10_t:
	mocha verify/monkey_spec.js -R spec -g "Monkey patch req and res"
	mocha verify/monkey_spec.js -R spec -g "Monkey patch before serving"
	mocha verify/monkey_spec.js -R spec -g "Setting req.app"
	mocha verify/monkey_spec.js -R spec -g 'req.res and res.req'
	mocha verify/monkey_spec.js -R spec -g "HTTP redirect"

lesson11_t:
	mocha verify/nego_spec.js -R spec -g 'sets the content-type'
	mocha verify/nego_spec.js -R spec -g 'sets the default content type'
	mocha verify/nego_spec.js -R spec -g 'Respond with different formats'
	mocha verify/nego_spec.js -R spec -g 'responds with 406'

lesson12_t:
	mocha verify/send_spec.js -R spec -g "support buffer and string body"
	mocha verify/send_spec.js -R spec -g "sets content-length"
	mocha verify/send_spec.js -R spec -g "sets status code"
	mocha verify/send_spec.js -R spec -g "JSON response"
	mocha verify -R spec -g 'Calculate Etag'
	mocha verify -R spec -g 'ETag 304'
	mocha verify -R spec -g 'Last-Modified 304'

lesson13_t:
	mocha verify/sendfile_spec.js -R spec -g "stream data"
	mocha verify/sendfile_spec.js -R spec -g 'stream file data'
	mocha verify/sendfile_spec.js -R spec -g 'content headers'
	mocha verify/sendfile_spec.js -R spec -g 'path checking'
	mocha verify/sendfile_spec.js -R spec -g 'Range support'
