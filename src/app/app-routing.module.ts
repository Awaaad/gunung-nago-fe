import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'cage',
    loadChildren: () => import('./features/cage/cage.module').then(m => m.CageModule)
  },
  {
    path: 'flock',
    loadChildren: () => import('./features/flock/flock.module').then(m => m.FlockModule)
  },
  {
    path: 'egg',
    loadChildren: () => import('./features/egg/egg.module').then(m => m.EggModule)
  },
  {
    path: 'survey',
    loadChildren: () => import('./features/survey/survey.module').then(m => m.SurveyModule)
  },
  {
    path: 'report',
    loadChildren: () => import('./features/report/report.module').then(m => m.ReportModule)
  },
  {
    path: 'health',
    loadChildren: () => import('./features/health/health.module').then(m => m.HealthModule)
  },
  {
    path: 'feed',
    loadChildren: () => import('./features/feed/feed.module').then(m => m.FeedModule)
  },
  {
    path: 'manure',
    loadChildren: () => import('./features/manure/manure.module').then(m => m.ManureModule)
  },
  {
    path: 'supplier',
    loadChildren: () => import('./features/supplier/supplier.module').then(m => m.SupplierModule)
  },
  {
    path: 'payment-mode',
    loadChildren: () => import('./features/payment/payment.module').then(m => m.PaymentModule)
  },
  {
    path: 'bank-account',
    loadChildren: () => import('./features/bank-account/bank-account.module').then(m => m.BankAccountModule)
  },
  {
    path: 'customer',
    loadChildren: () => import('./features/customer/customer.module').then(m => m.CustomerModule)
  },
  {
    path: 'sales-invoice',
    loadChildren: () => import('./features/sales-invoice/sales-invoice.module').then(m => m.SalesInvoiceModule)
  },
  {
    path: 'purchase-invoice',
    loadChildren: () => import('./features/purchase-invoice/purchase-invoice.module').then(m => m.PurchaseInvoiceModule)
  },
  {
    path: 'point-of-sale',
    loadChildren: () => import('./features/point-of-sale/point-of-sale.module').then(m => m.PointOfSaleModule)
  },
  {
    path: 'stock-update',
    loadChildren: () => import('./features/stock-update/stock-update.module').then(m => m.StockUpdateModule)
  },
  {
    path: 'security',
    loadChildren: () => import('./features/security/security.module').then(m => m.SecurityModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./features/user/user.module').then(m => m.UserModule)
  },
  {
    path: '',
    redirectTo: 'security',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
