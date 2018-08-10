'use strict';

app.controller('blogsController', function ($scope, postFactory, errorService) {

    // initalizes sections of index.html to display    
    $scope.views = {
        showingAllPosts: true,
        showingDeleteWarning: false,
        showingSinglePost: false,
        showingNewPostForm: false,
        showingEditPostForm: false
    };

    $scope.error = '';
    $scope.posts = [];
    $scope.currentPost = {};

    $scope.getAllPosts = () => {
        postFactory.getAllPosts()
            .then(posts => {
                $scope.posts = posts;
                renderView('showingAllPosts');
                $scope.currentPost = {};
            })
            .catch(error => $scope.error = errorService.getErrorTemplate(error));
    };

    $scope.getPost = postId => {
        postFactory.getPost(postId)
            .then(post => {
                $scope.currentPost = post;
            })
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

    $scope.editPost = id => {
        if ($scope.currentPost.title.length <= 0 || $scope.currentPost.body.length <= 0) {
            $scope.error = "Whoah buddy, something's blank."
        } else {
            postFactory.editPost(id, $scope.currentPost)
                .then(id => $scope.showSinglePost(id))                
                .catch(error => $scope.error = errorService.getErrorTemplate(error));
        }
    };

    $scope.deletePost = postId => {
        postFactory.deletePost(postId)
            .then(() => $scope.getAllPosts())
            .catch(error => $scope.error = errorService.getErrorTemplate(error));
    };

    $scope.showSinglePost = id => {
        renderView('showingSinglePost');
        $scope.getPost(id);
    };

    $scope.showPostForm = (msg, id = null) => {
        if (msg === 'new' && id === null) {
            renderView('showingNewPostForm');
            $scope.currentPost = { title: '', body: '' };
        } else {
            renderView('showingEditPostForm');
            $scope.getPost(id);
        }
    };

    $scope.showDeleteWarning = id => {
        renderView('showingDeleteWarning');
        $scope.getPost(id);
    };

    $scope.getAllPosts();

    /**
    * Sets requested view to true, all others to false
    * @param { string } view
    */
    const renderView = view => {
        $scope.error = '';
        Object.keys($scope.views).forEach(v => $scope.views[v] = false);
        $scope.views[view] = true;
    };
});