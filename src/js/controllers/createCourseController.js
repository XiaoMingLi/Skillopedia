// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("createCourseController", function($scope, $rootScope, $sce, $timeout, filterFilter, coursesServices, errorServices, toastServices, localStorageService, config) {
	$scope.input = {};
	$scope.step = 1;
	$scope.show_step = function(step) {
			$scope.step = step;
		}
		// 获取新建课程id
	toastServices.show();
	coursesServices.prapare_create_course().then(function(data) {
		toastServices.hide()
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			$scope.course_id = data.course_id
		} else {
			errorServices.autoHide(data.message);
		}
	});
	// 分类列表
	$scope.category_1 = [];
	$scope.category_2 = {};
	$scope.$watch("input.category_1", function(n, o) {
		if (n === o) return;
		$scope.input.category_2 = $scope.category_2[$scope.input.category_1.name][0];
	});
	toastServices.show();
	coursesServices.query_category().then(function(data) {
		toastServices.hide()
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			angular.forEach(data.Result.Categorys, function(category) {
				var obj = {};
				obj.name = category.category_01_name;
				obj.id = category.category_01_id;
				$scope.category_1.push(obj);
				$scope.category_2[category.category_01_name] = [];
				angular.forEach(category.category02s, function(sub) {
					var temp_obj = {};
					temp_obj.name = sub.category_02_name;
					temp_obj.id = sub.category_02_id;
					$scope.category_2[category.category_01_name].push(temp_obj);
				})
			});
			$scope.input.category_1 = $scope.category_1[0];
			$scope.input.category_2 = $scope.category_2[$scope.input.category_1.name][0];
		} else {
			errorServices.autoHide(data.message);
		}
	});
	// 证书列表
	$scope.input.certs = [{
		id: "",
		title: "",
		time: "",
		url: "",
		institute: ""
	}];
	// 增加证书输入
	$scope.add_cert = function() {
		var cert = {
			id: "",
			random_id: "",
			title: "",
			time: "",
			url: "",
			institute: ""
		};
		$scope.input.certs.push(cert);
	};
	$scope.remove_cert = function(cert) {
		$scope.input.certs = $scope.input.certs.filter(function(c) {
			return cert != c;
		})
		if (cert.id == "") return;
		toastServices.show();
		coursesServices.remove_certification({
			course_certification_id: cert.id
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				errorServices.autoHide(data.message);
			} else {
				errorServices.autoHide(data.message);
			}
		})
	};
	// 提交证书
	$scope.ajaxCert = function(cert) {
		toastServices.show();
		coursesServices.create_certification({
			course_id: $scope.course_id,
			name: cert.title,
			get_time: cert.time,
			institue: cert.institute,
			filename: cert.url
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				cert.id = data.course_certification_id;
				errorServices.autoHide(data.message);
			} else {
				errorServices.autoHide(data.message);
			}
		})
	};
	// 编辑证书
	$scope.editCert = function(cert) {
		toastServices.show();
		coursesServices.edit_certification({
			course_certification_id: cert.id,
			name: cert.title,
			get_time: cert.time,
			institue: cert.institute,
			filename: cert.url
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				errorServices.autoHide(data.message);
			} else {
				errorServices.autoHide(data.message);
			}
		})
	};
	// 封面
	// mock {id:"",url:""}
	$scope.input.covers = [];
	$scope.$on("upload_cover_success", function(event, args) {
		$scope.input.covers.push(args.message)
	});
	// 移除封面
	$scope.remove_cover = function(cover) {
		$scope.input.covers = $scope.input.covers.filter(function(c) {
			return cover != c;
		})
	};
	// video 视频路径
	$scope.input.videos = [{
		id: new Date().getTime(),
		url: ""
	}];
	// 增加视频输入
	$scope.add_video = function() {
		var video = {
			id: new Date().getTime(),
			url: "",
		}
		$scope.input.videos.push(video);
	};
	$scope.remove_video = function(video) {
		$scope.input.videos = $scope.input.videos.filter(function(v) {
			return video != v;
		})
	};
	// 第二步
	// 课程时长
	$scope.course_durations = ["60"];
	$scope.input.course_duration = $scope.course_durations[0];
	// teaching since
	$scope.input.teaching_since = "";
	// 课程费用
	$scope.input.rate = "";
	// 教育年限
	$scope.input.teaching_age = "";
	// addtional partner
	$scope.input.partner = "";
	$scope.input.surcharge = "";
	// 打折方式
	// unit:["Money","Amount"]
	$scope.input.discount = "by_money";
	$scope.input.discounts = [{
		message: "One-time Purchase",
		unit: "Money",
		purchase: "",
		discount: ""
	}];
	// 增加打折输入
	$scope.add_discount = function() {
		var discount = {
			message: "One-time Purchase",
			unit: "Money",
			purchase: "",
			off: ""
		}
		if ($scope.input.discounts.length > 3) {
			return;
		}
		if ($scope.input.discount == 'by_amount') {
			discount.unit = "Amount";
		}
		$scope.input.discounts.push(discount);
	}
	$scope.remove_discount = function(discount) {
		$scope.input.discounts = $scope.input.discounts.filter(function(d) {
			return discount != d;
		})
	}
	$scope.$watch("input.discount", function(n, o) {
		if (n === o) {
			return;
		}
		var unit = "Money";
		if (n == "by_amount") {
			unit = "Amount";
		}
		$scope.input.discounts = [{
			message: "One-time Purchase",
			unit: unit,
			purchase: "",
			discount: ""
		}];
	})
	$scope.confirm_discount = function(discount) {
		if ($scope.input.discount == 'by_money' && discount.money != "" && discount.off != "") {
			discount.mode = "preview";
			return;
		}
		if ($scope.input.discount == 'by_amount' && discount.amount != "" && discount.off != "") {
			discount.mode = "preview";
			return;
		}
		errorServices.autoHide("请填写");
	}
	$scope.edit_discount = function(discount) {
		discount.mode = "edit";
	};
	// 第三步
	$scope.input.travel_to_session = "1";
	$scope.input.distance = "";
	$scope.input.traffic_cost = "";
	$scope.input.street = "";
	$scope.input.apt = "";
	$scope.input.city = "";
	$scope.input.state = "";
	// zipcode
	$scope.input.zipcode = "";
	var suggestions = ["235689", "565237", "2356998", "53389"];
	$scope.$watch("input.zipcode", function(n, o) {
		$scope.input.suggestions = filterFilter(suggestions, n);
	})
	$scope.select = function(s) {
		$scope.input.zipcode = s;
		$timeout(function() {
			$scope.input.suggestions = [];
		}, 100)
	};
	$scope.location_mode = "edit";
	$scope.save_location = function() {
		$scope.location_mode = "preview";
		$scope.map_url = $scope.get_map($scope.input.state, $scope.input.city, $scope.input.street, $scope.input.apt);
	}
	$scope.edit_location = function() {
		$scope.location_mode = "edit";
	};
	// parse iframe map url
	$scope.get_map = function(state, city, street, apt) {
		var map_url = "https://maps.google.com/maps?q=" + state + city + street + apt + "&output=embed";
		return $sce.trustAsResourceUrl(map_url);
	};
	// 提交表单 最终创建课程
	$scope.ajaxForm = function() {
		var discount_onetion_pur_money_01, discount_price_01, discount_onetion_pur_money_02, discount_price_02, discount_onetion_pur_money_03, discount_price_03;
		if ($scope.input.discounts.length > 0) {
			discount_onetion_pur_money_01 = $scope.input.discounts[0].purchase;
			discount_price_01 = $scope.input.discounts[0].off;
		}
		if ($scope.input.discounts.length > 1) {
			discount_onetion_pur_money_02 = $scope.input.discounts[0].purchase;
			discount_price_02 = $scope.input.discounts[0].off;
		}
		if ($scope.input.discounts.length > 2) {
			discount_onetion_pur_money_03 = $scope.input.discounts[0].purchase;
			discount_price_03 = $scope.input.discounts[0].off;
		}
		console.log({
				course_id: $scope.course_id,
				title: $scope.input.title,
				category_01_id: $scope.input.category_1.id,
				category_01_name: $scope.input.category_1.name,
				category_02_id: $scope.input.category_2.id,
				category_02_name: $scope.input.category_2.name,
				overview: $scope.input.overview,
				fileName: $scope.input.covers.join("#"),
				vedioURL: $scope.input.videos.map(function(video) {
					return video.url
				}).join("#"),
				session_length: $scope.input.course_duration,
				session_rate: $scope.input.rate,
				teaching_age: $scope.input.teaching_age,
				teaching_since: $scope.input.teaching_since,
				travel_to_session: $scope.input.travel_to_session,
				travel_to_session_distance: $scope.input.distance,
				travel_to_session_trafic_surcharge: $scope.input.traffic_cost,
				city: $scope.input.state,
				area: $scope.input.city,
				address: $scope.input.street,
				latitude: "0",
				longitude: "0",
				additional_partner: $scope.input.partner,
				surcharge_for_each: $scope.input.surcharge,
				discount_type: $scope.input.discount == "by_money" ? "2" : "1",
				discount_onetion_pur_money_01: discount_onetion_pur_money_01,
				discount_price_01: discount_price_01,
				discount_onetion_pur_money_02: discount_onetion_pur_money_02,
				discount_price_02: discount_price_02,
				discount_onetion_pur_money_03: discount_onetion_pur_money_03,
				discount_price_03: discount_price_03,
			})
			// return;
		toastServices.show();
		coursesServices.create_course({
			course_id: $scope.course_id,
			title: $scope.input.title,
			category_01_id: $scope.input.category_1.id,
			category_01_name: $scope.input.category_1.name,
			category_02_id: $scope.input.category_2.id,
			category_02_name: $scope.input.category_2.name,
			overview: $scope.input.overview,
			fileName: $scope.input.covers.join("#"),
			vedioURL: $scope.input.videos.map(function(video) {
				return video.url
			}).join("#"),
			session_length: $scope.input.course_duration,
			session_rate: $scope.input.rate,
			teaching_age: $scope.input.teaching_age,
			teaching_since: $scope.input.teaching_since,
			travel_to_session: $scope.input.travel_to_session,
			travel_to_session_distance: $scope.input.distance,
			travel_to_session_trafic_surcharge: $scope.input.traffic_cost,
			city: $scope.input.state,
			area: $scope.input.city,
			address: $scope.input.street,
			latitude: "0",
			longitude: "0",
			additional_partner: $scope.input.partner,
			surcharge_for_each: $scope.input.surcharge,
			discount_type: $scope.input.discount == "by_money" ? "2" : "1",
			discount_onetion_pur_money_01: discount_onetion_pur_money_01,
			discount_price_01: discount_price_01,
			discount_onetion_pur_money_02: discount_onetion_pur_money_02,
			discount_price_02: discount_price_02,
			discount_onetion_pur_money_03: discount_onetion_pur_money_03,
			discount_price_03: discount_price_03,
		}).then(function(data) {
			toastServices.hide()
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				errorServices.autoHide(data.message);
				$timeout(function() {
					$rootScope.back();
				}, 2000)
			} else {
				errorServices.autoHide(data.message);
			}
		})
	}
});
// uploadController upload certs
angular.module("Skillopedia").controller("uploadController", function($scope, errorServices, toastServices, localStorageService, config) {
	var filename, extension;
	$scope.$on("flow::filesSubmitted", function(event, flow) {
		flow.files[0].name.replace(/.png|.jpg|.jpeg|.gif/g, function(ext) {
			extension = ext;
			return ext;
		})
		filename = new Date().getTime() + extension;
		flow.opts.target = config.url + "/app/Experiences/updatePic";
		flow.opts.testChunks = false;
		flow.opts.fileParameterName = "image_01";
		flow.opts.query = {
			"invoke": "h5",
			"token": localStorageService.get("token"),
			"filename": filename
		};
		flow.upload();
	});
	$scope.$on('flow::fileAdded', function(file, message, chunk) {
		$scope.cert.url = "";
	});
	$scope.$on('flow::fileSuccess', function(file, message, chunk) {
		$scope.cert.url = filename;
	});
});
// uploadCoversController
angular.module("Skillopedia").controller("uploadCoversController", function($scope, errorServices, toastServices, localStorageService, config) {
	var filename, extension;
	$scope.$on("flow::filesSubmitted", function(event, flow) {
		flow.files[0].name.replace(/.png|.jpg|.jpeg|.gif/g, function(ext) {
			extension = ext;
			return ext;
		})
		filename = new Date().getTime() + extension;
		flow.opts.target = config.url + "/app/Experiences/updatePic";
		flow.opts.testChunks = false;
		flow.opts.fileParameterName = "image_01";
		flow.opts.query = {
			"invoke": "h5",
			"token": localStorageService.get("token"),
			"filename": filename
		};
		toastServices.show();
		flow.upload();
	});
	$scope.$on('flow::fileAdded', function(file, message, chunk) {
		// $scope.cover.url = "";
	});
	$scope.$on('flow::fileSuccess', function(file, message, chunk) {
		$scope.$flow.files = [];
		$scope.$emit("upload_cover_success", {
			message: filename
		});
		toastServices.hide();
	});
})