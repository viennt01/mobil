import config from '~/config';

// Layouts
import { HeaderOnly } from '~/layouts';

// Pages
import Home from '~/pages/Home';
import Following from '~/pages/Following';
import Profile from '~/pages/Profile';
import Upload from '~/pages/Upload';
import Search from '~/pages/Search';
import Live from '~/pages/Live';
import Login from '~/pages/Login';
import Register from '~/pages/Register';
import ResetPassword from '~/pages/ResetPassword';
import ForgotPassword from '~/pages/ForgotPassword';
import ProjectDetail from '~/pages/projectDetail';
import Application from '~/pages/Application';
import Myproject from '~/pages/Myproject';
import Payment from '~/pages/Payment';

// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.following, component: Following },
    { path: config.routes.live, component: Live },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.projectDetail, component: ProjectDetail },
    { path: config.routes.application, component: Application },
    { path: config.routes.myproject, component: Myproject },
    { path: config.routes.upload, component: Upload, layout: HeaderOnly },
    { path: config.routes.login, component: Login, layout: HeaderOnly },
    { path: config.routes.register, component: Register, layout: HeaderOnly },
    { path: config.routes.resetPassword, component: ResetPassword, layout: HeaderOnly },
    { path: config.routes.forgotPassword, component: ForgotPassword, layout: HeaderOnly },
    { path: config.routes.search, component: Search, layout: null },
    { path: config.routes.payment, component: Payment},
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
