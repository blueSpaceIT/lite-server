import { Router } from 'express';
import { AccountRoutes } from '../modules/account/account.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { ArticleRoutes } from '../modules/article/article.route';
import { ArticleCategoryRoutes } from '../modules/articleCategory/articleCategory.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BatchRoutes } from '../modules/batch/batch.route';
import { BranchRoutes } from '../modules/branch/branch.route';
import { CouponRoutes } from '../modules/coupon/coupon.route';
import { CourseRoutes } from '../modules/course/course.route';
import { CourseCategoryRoutes } from '../modules/courseCategory/courseCategory.route';
import { CourseContentRoutes } from '../modules/courseContent/courseContent.route';
import { CourseReviewRoutes } from '../modules/courseReview/courseReview.route';
import { DashboardRoutes } from '../modules/dashboard/dashboard.route';
import { ExamAttemptRoutes } from '../modules/examAttempt/examAttempt.route';
import { MarqueeRoutes } from '../modules/marquee/marquee.route';
import { MediaRoutes } from '../modules/media/media.route';
import { ModuleRoutes } from '../modules/module/module.route';
import { NewsRoutes } from '../modules/news/news.route';
import { NewsCategoryRoutes } from '../modules/newsCategory/newsCategory.route';
import { OrderRoutes } from '../modules/order/order.route';
import { PayStationRoutes } from '../modules/paystation/paystation.route';
import { ProductRoutes } from '../modules/product/product.route';
import { ProductCategoryRoutes } from '../modules/productCategory/productCategory.route';
import { PurchaseRoutes } from '../modules/purchase/purchase.route';
import { QuestionRoutes } from '../modules/question/question.route';
import { SliderRoutes } from '../modules/slider/slider.route';
import { StudentRoutes } from '../modules/student/student.route';
import { TagRoutes } from '../modules/tag/tag.route';
import { ZoomRoutes } from '../modules/zoom/zoom.route';

// route initialization
const router: Router = Router();

// routes data
const routes = [
    {
        path: '/accounts',
        route: AccountRoutes,
    },
    {
        path: '/admins',
        route: AdminRoutes,
    },
    {
        path: '/articles',
        route: ArticleRoutes,
    },
    {
        path: '/article-categories',
        route: ArticleCategoryRoutes,
    },
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/batches',
        route: BatchRoutes,
    },
    {
        path: '/branches',
        route: BranchRoutes,
    },
    {
        path: '/coupons',
        route: CouponRoutes,
    },
    {
        path: '/courses',
        route: CourseRoutes,
    },
    {
        path: '/course-categories',
        route: CourseCategoryRoutes,
    },
    {
        path: '/course-contents',
        route: CourseContentRoutes,
    },
    {
        path: '/course-reviews',
        route: CourseReviewRoutes,
    },
    {
        path: '/dashboard',
        route: DashboardRoutes,
    },
    {
        path: '/exam-attempts',
        route: ExamAttemptRoutes,
    },
    {
        path: '/marquee',
        route: MarqueeRoutes,
    },
    {
        path: '/media',
        route: MediaRoutes,
    },
    {
        path: '/modules',
        route: ModuleRoutes,
    },
    {
        path: '/news',
        route: NewsRoutes,
    },
    {
        path: '/news-categories',
        route: NewsCategoryRoutes,
    },
    {
        path: '/orders',
        route: OrderRoutes,
    },
    {
        path: '/products',
        route: ProductRoutes,
    },
    {
        path: '/product-categories',
        route: ProductCategoryRoutes,
    },
    {
        path: '/purchases',
        route: PurchaseRoutes,
    },
    {
        path: '/questions',
        route: QuestionRoutes,
    },
    {
        path: '/sliders',
        route: SliderRoutes,
    },
    /* {
        path: '/sslcommerz',
        route: SSLCommerzRoutes,
    }, */
    {
        path: '/payment',
        route: PayStationRoutes,
    },
    {
        path: '/students',
        route: StudentRoutes,
    },
    {
        path: '/tags',
        route: TagRoutes,
    },
    {
        path: '/zoom',
        route: ZoomRoutes,
    },
];

// routes execution
routes.forEach(route => router.use(route.path, route.route));

export default router;
