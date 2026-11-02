/* forms */
(function ($) {

	var makeForms = function () {

		// make all the file inputs droppable
		$('[data-ajax="form"] [type="file"]').fileDrop({});

		$('[data-ajax="form"]').jkform();
	};
	$(document).ready(makeForms);

	/**
	 *
	 * jQuery Plugin that turns an input field of type "file" into a draggable zone and a file list that displays all
	 * the files.
	 *
	 * @param options
	 * @returns {*}
	 */
	$.fn.fileDrop = function (options) {
		return $(this).each(
			function () {
				var buildDefaultOptions = function () {
					var opts = $.extend({}, $.fn.fileDrop.defaultOptions);
					return opts;
				}
				var activeOptions = $.extend(buildDefaultOptions(), options);

				var fileField = $(this);
				var fileArray = [];

				var addFiles = function (files) {
					if (!files) {
						return;
					}
					//We need to send dropped files to Server
					for (var i = 0; i < files.length; i++) {
						fileArray.push(files[i]);
					}
					fileField.val('');
					fileField.data("files", fileArray);
					updateView();
				};

				var updateView = function () {
					fileList.html("");
					for (var i = 0; i < fileArray.length; i++) {
						fileList.append("<li>" + fileArray[i].name + "</li>");
					}

				}
				fileField.on('change', function (event) {
					addFiles($(fileField)[0].files);
				});

				var fileList = fileField.parents("form").find('[data-file-list="' + $(this).attr("name") + '"]');
				;
				var dropZone = fileField.parents("form").find('[data-drop-files="' + $(this).attr("name") + '"]');
				var chooseLink = dropZone.find('[data-choose-link]');
				chooseLink.on('click', function (e) {
					e.preventDefault();
					fileField.click();
				});
				dropZone.on('dragenter', function (e) {
					e.stopPropagation();
					e.preventDefault();
					$(this).addClass('hover');

				});
				dropZone.on('dragleave', function (e) {
					$(this).removeClass('hover');
				});
				dropZone.on('dragover', function (e) {
					e.stopPropagation();
					e.preventDefault();
				});
				dropZone.on('drop', function (e) {
					$(this).removeClass('hover');

					e.preventDefault();
					var files = e.originalEvent.dataTransfer.files;
					addFiles(files);


				});

				var updateList = function () {
					var text = editor.val(), evt = $.Event('change'), originalContent;
					if (active.text() === text || editor.hasClass('error')) {
						return true;
					}
					originalContent = active.html();
					active.text(text).trigger(evt, text);
					if (evt.result === false) {
						active.html(originalContent);
					}
				};

			});

	};
	$.fn.fileDrop.defaultOptions = {}


})(jQuery);

// undefined is used here as the undefined global variable in ECMAScript 3 is
// mutable (ie. it can be changed by someone else). undefined isn't really being
// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
// can no longer be modified.

// window and document are passed through as local variable rather than global
// as this (slightly) quickens the resolution process and can be more efficiently
// minified (especially when both are regularly referenced in your plugin).
(function ($, window, document, undefined) {
	"use strict";


	// Create the defaults once
	var pluginName = "jkform",
		defaults = {};

	// The actual plugin constructor
	function JKForm(element, options) {
		this.element = element;
		// jQuery has an extend method which merges the contents of two or
		// more objects, storing the result in the first object. The first object
		// is generally empty as we don't want to alter the default options for
		// future instances of the plugin
		this.settings = $.extend({}, defaults, options);
		this.test = false;
		this._defaults = defaults;
		this._name = pluginName;
		this.eventListeners = {
			afterSend: []
		};
		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend(JKForm.prototype, {
		init: function () {
			var self = this;
			// Place initialization logic here
			// You already have access to the DOM element and
			// the options via the instance, e.g. this.element
			// and this.settings
			// you can add more functions like the one below and
			// call them like so: this.yourOtherFunction(this.element, this.settings).
			// add bootstrap validator to all the forms
			$(this.element)
				.bootstrapValidator({
					live: "enabled"
				})
				// on success, we submit the form via ajax
				.on('success.form.bv', function (e) {
					// Prevent form submission
					e.preventDefault();

					// Get the form instance and other dom elements
					var $form = $(e.target);
					var $progress = $form.find("[data-progress]");
					var $response = $form.find(".response");

					// delete the coloring of the progress bar
					$progress.removeClass("progress-bar-success");

					// Get the BootstrapValidator instance
					var bv = $form.data('bootstrapValidator');

					// creating data to send
					var data = new FormData($form[0]);

					// for all file inputs, we iterate over the added files and add those separately to the FormData object
					$form.find('[type="file"]').each(function () {
						var files = $(this).data("files");
						if (files) {
							for (var i = 0; i < files.length; i++) {
								data.append($(this).attr("name"), files[i]);
							}
						}

					});

					// Use Ajax to submit form data
					$.ajax(
						{
							url: $form.attr('action'),
							method: "POST",
							cache: false,
							processData: false,
							contentType: false,
							type: 'POST',
							data: data,
							// we want json back
							dataType: 'json',
							// we use this function to add our progress bar handler
							xhr: function () {
								var myXhr = $.ajaxSettings.xhr();
								if (myXhr.upload) { // check if upload property exists
									myXhr.upload.addEventListener('progress', function (evt) {
										if (evt.lengthComputable) {
											$progress.css("width", (evt.loaded / evt.total * 100) + "%");
										}
									}, false); // for handling the progress of the upload
								}
								return myXhr;
							}
						})
						// when ajax is finished, we display message and do other stuff
						.done(function (result) {
							if (typeof variable !== 'undefined' && grecaptcha.reset) {
                            	grecaptcha.reset();
							}
							// check the result json
							if (result.type == "success") {
								// make the progress bar green
								$progress.addClass("progress-bar-success");
								// reset the form
								if ($form.attr("data-reset") !== "false") {
									$form.each(function () {
										this.reset();
									});
								}
							}
							if (result.message.indexOf("alert") <= 0)
								result.message = '<div class="alert alert-' + (result.type == "success" ? 'success' : 'danger') + '">' + result.message + '</div>';
							// set html of response element
							$response.html(result.message);

							if(result.skip === 'undefined' || !result.skip){
								// fade message out after x time
								$response.fadeTo(4000, 500).slideUp(500, function(){
									$response.slideUp(500, function(){
										// redirect if nececary
										if (result.redirect) location.href = result.redirect;

										// reload if nececary
										if (result.reload) location.reload();
									});
								});
							}else{
								// redirect if nececary
								if (result.redirect) location.href = result.redirect;

								// reload if nececary
								if (result.reload) location.reload();
							}

							jQuery.each(self.eventListeners.afterSend, function () {
								this(result);
							})
						});
				});
		},
		addListener: function (name, fun) {
			this.eventListeners[name].push(fun);
		}
	});

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new JKForm(this, options));
			}
		});
	};

})(jQuery, window, document);


// undefined is used here as the undefined global variable in ECMAScript 3 is
// mutable (ie. it can be changed by someone else). undefined isn't really being
// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
// can no longer be modified.

// window and document are passed through as local variable rather than global
// as this (slightly) quickens the resolution process and can be more efficiently
// minified (especially when both are regularly referenced in your plugin).
(function ($, window, document, undefined) {
	"use strict";


	// Create the defaults once
	var pluginName = "jksimpleeditabledom",
		defaults = {};

	// The actual plugin constructor
	function JKSimpleEditableDom(element, options) {
		this.element = element;
		// jQuery has an extend method which merges the contents of two or
		// more objects, storing the result in the first object. The first object
		// is generally empty as we don't want to alter the default options for
		// future instances of the plugin
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend(JKSimpleEditableDom.prototype, {
		init: function () {
			var self = this;
			// Place initialization logic here
			// You already have access to the DOM element and
			// the options via the instance, e.g. this.element
			// and this.settings
			// you can add more functions like the one below and
			// call them like so: this.yourOtherFunction(this.element, this.settings).
			// add bootstrap validator to all the forms

			this.displayPane = $(this.element).find('[data-display-pane]');
			this.editPane = $(this.element).find('[data-edit-pane]');

			this.editButton = $(this.element).find('[data-edit-button]');
			this.editButton.click(function (e) {
				e.preventDefault();
				self.edit();
			});
			this.saveButton = $(this.element).find('[data-save-button]');
			this.saveButton.click(function (e) {
				e.preventDefault();
				self.editPane.find("form").submit();
			});

			this.resultPane = $(this.element).find('[data-result]');
			this.display();

			this.jkform = this.editPane.find("form").data("plugin_jkform");
			if (this.jkform) {
				this.jkform.addListener("afterSend", function (result) {
					self.resultPane.html(result.message);

					if (result.type = "success") {
						self.display();
						self.displayPane.html(result.displayPaneHtml);
					}
				})
			}
		},
		display: function () {
			this.editPane.css("display", "none");
			this.displayPane.css("display", "block");
			this.saveButton.css("display", "none");
			this.editButton.css("display", "inline-block");
		},
		edit: function () {
			this.editPane.css("display", "block");
			this.displayPane.css("display", "none");
			this.editButton.css("display", "none");
			this.saveButton.css("display", "inline-block");

		}
	});

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new JKSimpleEditableDom(this, options));
			}
		});
	};

	$(document).ready(function () {

		$('[data-simple-editable-dom]').jksimpleeditabledom();
	})

})(jQuery, window, document);

/* gallery */
(function ($) {

	function buildCarousel() {
		var i = 0;
		$("[data-gallery]").each(function () {
			i++;
			var carouselLinks = [];
			$(this).find("a").each(function (my_i) {
				carouselLinks.push({href: $(this).attr("href"), title: $(this).attr("data-popup-caption")});
				$(this).click(function (e) {
					e.preventDefault();
					blueimp.Gallery(carouselLinks, {
						container: '#blueimp-gallery', index: my_i, hidePageScrollbars: false
					});
				});
			});
		});

	}

	$(document).ready(buildCarousel);

})(jQuery);


/* toggle */
(function ($) {

	function doToggle() {
		$('[data-action="toggle"]').click(function (e) {
			$($(this).attr("data-target")).toggleClass($(this).attr("data-toggle-class"));
		})
	}

	$(document).ready(doToggle);

})(jQuery);


/* fetch */
(function ($) {

	function doFetch() {
		$('[data-ajax="fetch"]').click(function (e) {
			e.preventDefault();

			$.ajax(
				{
					url: $(this).attr('href'),
					method: "GET",
					cache: false,
					processData: false,
					contentType: false,
					// we want json back
					dataType: 'json'
				})
			// when ajax is finished, we display message and do other stuff
				.done(function (result) {
					// check the result json
					if (result.type == "success") {
					}
					if (result.message.indexOf("alert") <= 0)
						result.message = '<div class="alert alert-' + (result.type == "success" ? 'success' : 'danger') + '">' + result.message + '</div>';

					// redirect if nececary
					if (result.redirect) location.href = result.redirect;
					// reload if nececary
					if (result.reload) location.reload();
				});
		})
	}

	$(document).ready(doFetch);

})(jQuery)