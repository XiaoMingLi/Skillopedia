// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("skillopediaController", function($scope, $rootScope, $location, $timeout, coursesServices, errorServices, toastServices, localStorageService, config) {
	// 未认证，跳转认证
	// agent_level 1:普通用户 2:教练
	if ($rootScope.user.agent_level != "2") {
		$location.path("authenication").replace();
		return;
	}
	$scope.courses = [];
	$scope.page = {
		pn: 1,
		page_size: 10,
		message: "点击加载更多",
		latitude: "0",
		longitude: "0"
	}
	$scope.loadMore = function() {
		if ($scope.no_more) {
			return;
		}
		toastServices.show();
		$scope.page.message = "正在加载...";
		coursesServices.query_courses_by_user($scope.page).then(function(data) {
			toastServices.hide();
			$scope.page.message = "点击加载更多";
			if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
				$scope.courses = $scope.courses.concat(data.Result.Courses.list);
				$scope.no_more = $scope.courses.length == data.Result.Courses.totalRow ? true : false;
			} else {
				errorServices.autoHide("服务器错误");
			}
			if ($scope.no_more) {
				$scope.page.message = "加载完成，共加载" + $scope.courses.length + "条记录";
			}
			$scope.page.pn++;
		})

	}
	$scope.loadMore();
	// go to detail
	$scope.local_go = function(id) {
		$location.path("detail").search({
			category: null,
			cagegory_id: null,
			course_id: id
		});
	};
	// edit course
	$scope.edit_course = function(course_id, e) {

	};
	// remove course
	$scope.remove_course = function(course_id, e) {
		e.preventDefault();
		e.stopPropagation();
		$scope.confirm.content = "确定删除吗？";
		$scope.confirm.open();
		$scope.confirm.cancle_callback = function() {}
		$scope.confirm.ok_callback = function() {
			toastServices.show();
			coursesServices.remove_course({
				course_id: course_id
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
	}
})