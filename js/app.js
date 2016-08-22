(function () {
    'use strict';

    var CRUD = angular.module('CRUD', []);

    CRUD.controller('crudController', ['$scope', 'MemberService', function ($scope, MemberService) {
        /** 新增人員的物件 */
        $scope.newMemberInstance = {
            name: null,
            phone: null,
            address: null
        };

        /** Function 定義 */
        $scope.isReadOnly = isReadOnly;
        $scope.showNewMemberRow = showNewMemberRow;
        $scope.setNewMemberRow = setNewMemberRow;
        $scope.isShowNewMemberRow = isShowNewMemberRow;
        $scope.resetNewMemberInstance = resetNewMemberInstance;
        $scope.create = create;
        $scope.edit = edit;
        $scope.update = update;
        $scope.remove = remove;

        /** 主程式 */
        var members = MemberService.getMembers();
        if (members.$$state) {
            members.then(function (members) {
               $scope.members = members;
            }, function () {
                throw new Error('getMembers is Error!');
            });
        } else {
            $scope.members = members;
        }

        /** Function 實作 */
        /** 是否可編輯 */
        function isReadOnly(member) {
            if (member.readonly === false) {
                return false;
            }
            return true;
        }

        /** 顯示新增人員的輸入區塊 */
        function showNewMemberRow() {
            $scope.resetNewMemberInstance();
            $scope.setNewMemberRow(true);
        }

        /** 設定顯示新增人員輸入區塊 */
        function setNewMemberRow(b) {
            $scope.newMemberRowVisible = b;
        }

        /** 判斷是否顯示新增人員輸入區塊 */
        function isShowNewMemberRow() {
            return $scope.newMemberRowVisible;
        }

        /** 新增人員物件的重置 Function */
        function resetNewMemberInstance() {
            $scope.newMemberInstance = {
                name: null,
                phone: null,
                address: null
            };
        }

        /** 建立人員 */
        function create(member) {
            $scope.members.push({
                name: member.name,
                phone: member.phone,
                address: member.address
            });
            // $scope.setNewMemberRow(false);
            $scope.resetNewMemberInstance();
        }

        /** 編輯人員 */
        function edit(member) {
            member.readonly = false;
        }

        /** 更新人員 */
        function update(member) {
            delete member.readonly;
        }

        /** 刪除人員 */
        function remove(member) {
            var idx = $scope.members.indexOf(member);
            if (idx != -1) {
                $scope.members.splice(idx, 1);
            }
        }
    }]);

    CRUD.factory('Common', [function () {
        return {
            members: null
        };
    }]);

    CRUD.service('MemberService', ['Common','$http', '$q', function (Common, $http, $q) {
        this.getMembers = getMembers;

        function getMembers() {
            if (Common.members == null) {
                var defer = $q.defer();

                $http.get('json/getMembers.json').then(function (resp) {
                        Common.members = resp.data.data;
                        defer.resolve(Common.members);
                    }, function (error) {
                        defer.reject();
                    }
                );

                return defer.promise;
            } else {
                return Common.members;
            }
        }
    }]);

})();