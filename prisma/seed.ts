import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@devblog.com',
      passwordHash: adminHash,
      role: Role.ADMIN,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });

  const user = await prisma.user.create({
    data: {
      name: 'John Developer',
      email: 'user@devblog.com',
      passwordHash: userHash,
      role: Role.USER,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    },
  });

  console.log('✅ Users created');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Frontend', slug: 'frontend' } }),
    prisma.category.create({ data: { name: 'Backend', slug: 'backend' } }),
    prisma.category.create({ data: { name: 'DevOps', slug: 'devops' } }),
    prisma.category.create({ data: { name: 'Database', slug: 'database' } }),
    prisma.category.create({ data: { name: 'Other', slug: 'other' } }),
  ]);

  const [frontend, backend, devops, database, other] = categories;

  console.log('✅ Categories created');

  // Create articles
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: 'Getting Started with React 18',
        slug: 'getting-started-with-react-18',
        content: `React 18 introduces several powerful features including automatic batching, concurrent rendering, and the new useTransition hook. In this article, we'll explore how to migrate your existing React application to take advantage of these improvements.\n\nAutomatic batching means that React will now batch state updates that happen outside of React event handlers — like in setTimeout, promises, and native event handlers — automatically. This reduces the number of re-renders and improves performance.\n\nThe useTransition hook allows you to mark some state updates as non-urgent, telling React that they can be interrupted if something more urgent comes up. This is particularly useful for heavy computations that might cause the UI to feel sluggish.`,
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        published: true,
        authorId: admin.id,
        categoryId: frontend.id,
      },
    }),
    prisma.article.create({
      data: {
        title: 'Building REST APIs with NestJS',
        slug: 'building-rest-apis-with-nestjs',
        content: `NestJS is a progressive Node.js framework for building efficient and scalable server-side applications. It uses TypeScript by default and combines elements of OOP, FP, and FRP.\n\nIn this tutorial, we'll build a complete REST API from scratch using NestJS, including authentication with JWT, database integration with Prisma, and API documentation with Swagger.\n\nNestJS follows Angular's architectural patterns, which makes it very familiar to Angular developers. The module system, dependency injection, and decorator-based approach provide a solid foundation for large-scale applications.`,
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
        published: true,
        authorId: admin.id,
        categoryId: backend.id,
      },
    }),
    prisma.article.create({
      data: {
        title: 'Docker and Kubernetes for Developers',
        slug: 'docker-and-kubernetes-for-developers',
        content: `Containerization has revolutionized how we deploy and manage applications. Docker makes it easy to package your application and its dependencies into a container, while Kubernetes provides orchestration for running containers at scale.\n\nIn this article, we'll cover the basics of Docker — from building images to running containers — and then explore how Kubernetes can help you manage containerized applications in production.\n\nWe'll also look at common patterns like multi-stage builds, health checks, and resource limits that are essential for production-ready containers.`,
        imageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800',
        published: true,
        authorId: user.id,
        categoryId: devops.id,
      },
    }),
    prisma.article.create({
      data: {
        title: 'PostgreSQL Performance Tuning',
        slug: 'postgresql-performance-tuning',
        content: `PostgreSQL is one of the most powerful open-source relational databases available. However, to get the best performance out of it, you need to understand how the query planner works and how to optimize your schema and queries.\n\nIn this deep dive, we'll cover indexing strategies, query optimization with EXPLAIN ANALYZE, connection pooling with PgBouncer, and configuration tuning for different workloads.\n\nWe'll also explore partitioning large tables, using materialized views for expensive queries, and monitoring performance with pg_stat_statements.`,
        imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
        published: true,
        authorId: admin.id,
        categoryId: database.id,
      },
    }),
    prisma.article.create({
      data: {
        title: 'TypeScript Advanced Types Deep Dive',
        slug: 'typescript-advanced-types-deep-dive',
        content: `TypeScript's type system is incredibly powerful. Beyond the basics of interfaces and type aliases, there's a whole world of conditional types, mapped types, template literal types, and more.\n\nThis article explores some of the most useful advanced TypeScript patterns that can help you write more type-safe and maintainable code.\n\nWe'll cover utility types like Partial, Required, Pick, and Omit, then move on to more advanced topics like infer, distributive conditional types, and recursive types.`,
        imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
        published: true,
        authorId: user.id,
        categoryId: frontend.id,
      },
    }),
    prisma.article.create({
      data: {
        title: 'CI/CD Pipeline with GitHub Actions (Draft)',
        slug: 'cicd-pipeline-github-actions',
        content: `This article is still being written. It will cover setting up a complete CI/CD pipeline using GitHub Actions for a Node.js application.\n\nTopics will include: automated testing, Docker image builds, deployment to cloud providers, and environment management.`,
        imageUrl: null,
        published: false,
        authorId: admin.id,
        categoryId: devops.id,
      },
    }),
    prisma.article.create({
      data: {
        title: 'Redis Caching Strategies (Draft)',
        slug: 'redis-caching-strategies',
        content: `Draft article covering Redis caching patterns including cache-aside, write-through, and write-behind. Will also cover Redis data structures and when to use each.`,
        imageUrl: null,
        published: false,
        authorId: user.id,
        categoryId: database.id,
      },
    }),
    prisma.article.create({
      data: {
        title: 'Clean Code Principles Every Developer Should Know (Draft)',
        slug: 'clean-code-principles',
        content: `Work in progress. This will be a comprehensive guide to writing clean, maintainable code following SOLID principles and common design patterns.`,
        imageUrl: null,
        published: false,
        authorId: user.id,
        categoryId: other.id,
      },
    }),
  ]);

  console.log('✅ Articles created');

  const [article1, article2, article3, article4, article5] = articles;

  // Create comments
  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Great article! The section on automatic batching was really helpful.',
        authorId: user.id,
        articleId: article1.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'I have been using React 18 for a while now and useTransition is a game changer.',
        authorId: admin.id,
        articleId: article1.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'NestJS is my go-to framework for backend development. Excellent write-up!',
        authorId: user.id,
        articleId: article2.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Would love to see a follow-up on NestJS with GraphQL.',
        authorId: user.id,
        articleId: article2.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Kubernetes still feels overwhelming to me. Do you have beginner resources?',
        authorId: admin.id,
        articleId: article3.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'The EXPLAIN ANALYZE section saved me hours of debugging slow queries!',
        authorId: user.id,
        articleId: article4.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Partitioning was exactly what I needed for my time-series data.',
        authorId: admin.id,
        articleId: article4.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'The infer keyword finally makes sense after reading this. Thank you!',
        authorId: admin.id,
        articleId: article5.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Mapped types are so underused. Great examples here.',
        authorId: admin.id,
        articleId: article5.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Can you add examples with template literal types?',
        authorId: user.id,
        articleId: article5.id,
      },
    }),
  ]);

  console.log('✅ Comments created');
  console.log('🎉 Seeding complete!');
  console.log('');
  console.log('Test credentials:');
  console.log('  Admin: admin@devblog.com / admin123');
  console.log('  User:  user@devblog.com  / user123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
