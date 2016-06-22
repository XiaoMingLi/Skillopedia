// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("showCommentsController", function($scope, $rootScope, $routeParams, userServices, errorServices, toastServices, localStorageService, config) {
	if (!$routeParams.user_id) {
		$rootScope.back();
		return;
	}
	if ($routeParams.user_id) {
		$scope.user_id = $routeParams.user_id
	};
	// 用户信息
	toastServices.show();
	userServices.query_basicinfo_id({
		user_id: $routeParams.user_id
	}).then(function(data) {
		toastServices.hide()
		if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
			$scope.user = data.Result.UserInfo
		} else {
			errorServices.autoHide(data.message);
		}
	});
	$scope.comments = [];
	$scope.page = {
		pn: 1,
		page_size: 10,
		message: "点击加载更多"
	}
	$scope.loadMore = function() {
		if ($scope.no_more) {
			return;
		}
		toastServices.show();
		$scope.page.message = "正在加载...";
		$scope.page.user_id = $routeParams.user_id
		userServices.query_comments_by_user_id($scope.page).then(function(data) {
			toastServices.hide();
			$scope.page.message = "点击加载更多";
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.comments = $scope.comments.concat(data.Result.Comments.list);
				$scope.no_more = $scope.comments.length == data.Result.Comments.totalRow ? true : false;
			} else {
				errorServices.autoHide("服务器错误");
			}
			if ($scope.no_more) {
				$scope.page.message = "加载完成，共加载" + $scope.comments.length + "条记录";
			}
			$scope.page.pn++;
		})

	}
	$scope.loadMore();
	$scope.to_fix = function(m) {
		return m.toFixed(1);
	}
})