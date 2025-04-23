/*********************************************************************
 * Based on Events.js from CS326 frontend integration example tasks-v2
 * This object contains the various event/message types used in our app
 *********************************************************************/
export const Events = {
    // Post Creation 
    NewPost: 'NewPost',

    // Post Browsing 
    LoadPosts: 'LoadPosts',
    LoadPostsSuccess: 'LoadPostsSuccess',
    LoadPostsFailure: 'LoadPostsFailure',

    // Post Viewing
    LoadPost: 'LoadPost',
    LoadPostSuccess: 'LoadPostSuccess',
    LoadPostFailure: 'LoadPostFailure',

    // Post Viewing ??? todo
    UpdatePost: 'UpdatePost',
    UpdatePostSuccess: 'UpdatePostSuccess',
    UpdatePostFailure: 'UpdatePostFailure',

    // Post Creation
    StorePost: 'StorePost',
    StorePostSuccess: 'StorePostSuccess',
    StorePostFailure: 'StorePostFailure',

    // Post Browsing Wipe DB
    UnStorePosts: 'UnStorePosts',
    UnStorePostsSuccess: 'UnStorePostsSuccess',
    UnStorePostsFailure: 'UnStorePostsFailure',

    // Post Browsing -- expired
    UnStorePost: 'UnStorePost',
    UnStorePostSuccess: 'UnStoreFullPostSuccess',
    UnStorePostFailure: 'UnStoreFullPostFailure',

    // View Switching Events
    SwitchToPostBrowsingView: 'SwitchToPostBrowsingView',
    SwitchToPostViewingView: 'SwitchToPostViewingView',

    // Location Browsing
    ExpandLocationCard: 'ExpandLocationCard',
    MinimizeLocationCard: 'MinimizeLocationCard',
    OpenReportModal: 'OpenReportModal',
    CloseReportModal: 'CloseReportModal',

    // Crowding Score Reporting
    AddReport: 'AddReport', // trigger html post method
    DeleteReport: 'DeleteReport', // trigger html delete method for deletion of singular report
    ClearAllReports: 'ClearAllReports', // trigger html delete method for deleting all reports
    DeleteReportSuccess: 'DeleteReportSuccess', // for UI updates
    ClearAllReportsSuccess: 'ClearAllReportsSuccess'
}
  