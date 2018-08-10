'use strict';

let app = angular.module('fastBlogger', []);

app.controller('blogsController', function ($scope, postFactory, errorService) {
    
    $scope.error = '';
    $scope.posts = [];
    $scope.showingAllPosts = true;
    $scope.showingPostForm = false;
    $scope.currentPost = {};

    $scope.getAllPosts = blogId => {
        postFactory.getAllPosts(1)
            .then(posts => {
                $scope.posts = posts;
                $scope.showingAllPosts = true;
            })
            .catch(error => $scope.error = errorService.getErrorTemplate(error));
    };

    $scope.getPost = postId => {

    };

    $scope.addPost = postModel => {
        if (postModel.title.length <= 0 || postModel.body.length <= 0) {
            $scope.error = "Whoah buddy, something's blank."
        } else {
            postFactory.addPost(postModel)
                .then(() => {
                    $scope.showingPostForm = false;
                    $scope.getAllPosts();
                })
                .catch(error => $scope.error = errorService.getErrorTemplate(error));
        }
    };

    $scope.editPost = (postId, postModel) => {

    };

    $scope.deletePost = postId => {

    };

    $scope.showPostForm = msg => {
        $scope.showingAllPosts = false;
        $scope.showingPostForm = true;
        if (msg === 'new') {
            $scope.currentPost = {
                title: '',
                body: ''
            };
        } else {
            // TODO : edit post logic here
        }
    };

    $scope.getAllPosts();
});

app.factory('postFactory', function($q, $http, authFactory) {

    const domain = 'http://localhost:3000'
    
    const getAllPosts = (id) => {
        return $q((resolve, reject) => {
            $http.get(domain + '/posts/')
                .then(posts => resolve(posts.data))
                .catch(e => { console.log(e); reject(e)});
        });
    };

    const getPost = () => {};

    const addPost = (model) => {
        return $q((resolve, reject) => {
            $http({
                method: 'POST',
                url: domain + '/posts/',
                data: model
            })
            .then(data => resolve(data))
            .catch(error => reject(error));
        });
    };

    const editPost = () => {};

    const deletePost = () => {};

    return {
        getAllPosts,
        getPost,
        addPost,
        editPost,
        deletePost
    };
});

app.factory('authFactory', function() {
    return {
        isAuth: id => {

        }
    };
});

app.service('errorService', function() {
    return {
        getErrorTemplate: error => {
            return 
                `Well shoot, we had this happen:
                ${ error.status }: ${ error.message }`;
        }
    };
});