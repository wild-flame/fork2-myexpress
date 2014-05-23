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
lesson5_t: layerClass_t addLayer_t matchPath_t
layerClass_t:
	mocha verify/app_spec.js -R spec -g 'Layer class and the match method'
addLayer_t:
	mocha verify -R spec -g 'app.use should add a Layer to stack'
matchPath_t:
	mocha verify -R spec -g 'The middlewares called should match request path'
	.PHONY: lesson4_t lesson4_m lesson5_t lesson5_m
