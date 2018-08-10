'use strict';

let app = angular.module('fastBlogger', []);

app.controller('blogsController', function ($scope, postFactory, errorService) {
    
    // initalizes sections of index.html to display    
    $scope.views = {
        showingAllPosts:  true,
        showingPostForm:  false,
        showingDeleteWarning:  false,
        showingSinglePost: false
    };

    $scope.error = '';
    $scope.posts = [];
    $scope.currentPost = {};

    $scope.getAllPosts = blogId => {
        postFactory.getAllPosts(1)
            .then(posts => {
                $scope.posts = posts;
                renderView('showingAllPosts');
            })
            .catch(error => $scope.error = errorService.getErrorTemplate(error));
    };

    $scope.getPost = postId => {
        postFactory.getPost(postId)
            .then(post => $scope.currentPost = post)
            .catch(error => errorService.getErrorTemplate(error));
    };

    $scope.addPost = postModel => {
        if (postModel.title.length <= 0 || postModel.body.length <= 0) {
            $scope.error = "Whoah buddy, something's blank."
        } else {
            postFactory.addPost(postModel)
                .then(() => {
                    renderView('showingAllPosts');
                    $scope.getAllPosts();
                })
                .catch(error => $scope.error = errorService.getErrorTemplate(error));
        }
    };

    $scope.editPost = (postId, postModel) => {

    };

    $scope.deletePost = postId => {
        postFactory.deletePost(postId)
            .then(() => $scope.getAllPosts())
            .catch(error => $scope.error = errorService.getErrorTemplate(error));
    };

    $scope.showPostForm = msg => {
        renderView('showingPostForm');
        if (msg === 'new') {
            $scope.currentPost = { title: '', body: '' };
        } else {
            // TODO : edit post logic here
        }
    };

    $scope.showDeleteWarning = id => {
        renderView('showingDeleteWarning');
        $scope.getPost(id);
    };

    $scope.getAllPosts();

    const renderView = view => {
        Object.keys($scope.views).forEach(v => $scope.views[v] = false);
        $scope.views[view] = true;
    };
});

app.factory('postFactory', function($q, $http, authFactory) {

    const domain = 'http://localhost:3000'
    
    const getAllPosts = (id) => {
        return $q((resolve, reject) => {
            $http.get(domain + '/posts/')
                .then(posts => resolve(posts.data))
                .catch(e => reject(e));
        });
    };

    const getPost = (id) => {
        return $q((resolve, reject) => {
            $http.get(domain + '/posts/' + id)
                .then(post => resolve(post.data))
                .catch(e => reject(e));
        });
    };

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

    const deletePost = id => {
        return $q((resolve, reject) => {
            $http({
                method: 'DELETE',
                url: domain + '/posts/' + id                
            })
            .then( _ => resolve())
            .catch(error => reject(error));
        });
    };

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