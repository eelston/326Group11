/*********************************************************************
 * Based on Events.js from CS326 frontend integration example tasks-v2
 * This object contains the various event/message types used in our app
 *********************************************************************/
export const Events = {
    // Post Creation 
    NewPost: 'NewPost',
    NewUser: 'NewUser',

    // Post Browsing
    FilterPosts: 'FilterPosts',
    FilterPostsSuccess: 'FilterPostsSuccess',
    FilterPostsFailure: 'FilterPostsFailure',

    // Post Browsing 
    LoadPosts: 'LoadPosts',
    LoadPostsSuccess: 'LoadPostsSuccess',
    LoadPostsFailure: 'LoadPostsFailure',

    LoadUserData: "LoadUserData",
    LoadUserDataSuccess: "LoadUserDataSuccess",
    LoadUserDataFailure: "LoadUserDataFailure",

    // Post Viewing
    LoadPost: 'LoadPost',
    LoadPostSuccess: 'LoadPostSuccess',
    LoadPostFailure: 'LoadPostFailure',

    // Post Viewing 
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

    // Location Browsing
    ExpandLocationCard: 'ExpandLocationCard',
    MinimizeLocationCard: 'MinimizeLocationCard',
    OpenReportModal: 'OpenReportModal',
    CloseReportModal: 'CloseReportModal',

    // Crowding Score Reporting
    AddReport: 'AddReport', // trigger html post method
    AddReportSuccess: 'AddReportSuccess', // for UI updates
    DeleteReport: 'DeleteReport', // trigger html delete method for deletion of singular report
    DeleteReportSuccess: 'DeleteReportSuccess', // for UI updates

    //Register Events
    Signup: 'Signup',
    SignupSuccess: 'SignupSuccess',
    SignupFailure: 'SignupFailure',

    Login: 'Login',
    LoginSuccess: 'LoginSuccess',
    LoginFailure: 'LoginFailure',
    
    Logout: 'Logout',
    LogoutSuccess: 'LogoutSuccess',
    LogoutFailure: 'LogoutFailure',
}
  