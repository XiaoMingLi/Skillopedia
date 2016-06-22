// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("ordersManagementController", function($scope, $route, $window, $timeout, $location, orderServices, errorServices, toastServices, localStorageService, config) {
	$scope.input = {
		order_type: '1'
	}
	$scope.orders = [];
	$scope.page = {
		pn: 1,
		page_size: 10,
		message: "点击加载更多",
		latitude: "0",
		longitude: "0",
		order_type: $scope.input.order_type
	}
	$scope.loadMore = function() {
		if ($scope.no_more) {
			return;
		}
		toastServices.show();
		$scope.page.message = "正在加载...";
		orderServices.query_manage_orders($scope.page).then(function(data) {
			toastServices.hide();
			$scope.page.message = "点击加载更多";
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.orders = $scope.orders.concat(data.Result.CoachOrderList.list);
				$scope.no_more = $scope.orders.length == data.Result.CoachOrderList.totalRow ? true : false;
			} else {
				errorServices.autoHide("服务器错误");
			}
			if ($scope.no_more) {
				$scope.page.message = "加载完成，共加载" + $scope.orders.length + "条数据";
			}
			$scope.page.pn++;
		})

	}
	$scope.loadMore();
	$scope.active_tab = function(tab_index) {
		if (tab_index == $scope.input.order_type) {
			return;
		}
		$scope.input.order_type = tab_index;
		$scope.orders = [];
		$scope.page = {
			pn: 1,
			page_size: 10,
			message: "点击加载更多",
			latitude: "0",
			longitude: "0",
			order_type: $scope.input.order_type
		}
		$scope.no_more = false;
		$scope.loadMore();
	};
	// 查看地图
	$scope.open_map = function(course, e) {
		e.preventDefault();
		e.stopPropagation();
		$.magnificPopup.open({
			items: {
				src: "https://maps.google.com/maps?q=" + course.city + course.area + course.street + course.address
			},
			type: "iframe"
		});
	};
	// 获取状态字
	$scope.get_status_message = function(status) {
		var status_message = {
			"2": "expired",
			"10": "expired",
			"11": "Unpay",
			"21": "Payed",
			"22": "Payed",
			"30": "Finish",
			"40": "Finish"
		}
		return status_message[status];
	};
	// remove order
	$scope.remove = function(order) {
		$scope.confirm.content = "确定删除吗？";
		$scope.confirm.open();
		$scope.confirm.cancle_callback = function() {}
		$scope.confirm.ok_callback = function() {
			toastServices.show();
			orderServices.remove({
				delete_type: "1",
				orders_ids: order.orders_id
			}).then(function(data) {
				toastServices.hide()
				if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
					errorServices.autoHide(data.message);
					$timeout(function() {
						$route.reload();
					}, 2000)
				} else {
					errorServices.autoHide(data.message);
				}
			})
		}
	};
	// pay order
	$scope.pay = function(order) {
		var url = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/#/payment?id=" + order.orders_id;
		$window.open(url);
	};
	$scope.local_go = function(id) {
		$location.path("order_management").search("id", id)
	}
})