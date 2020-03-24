from django.db import models
from datetime import datetime
from front_enum import Status, ParameterKey
from django.db.models import Count, F, Value


class Category(models.Model):
    eng_name = models.CharField(max_length=20, default='', null=True, blank=True)
    persian_name = models.CharField(max_length=20, default='', null=True, blank=True)
    description = models.CharField(max_length=255, default='', null=True, blank=True)

    def __repr__(self):
        return self.__str__()

    def __str__(self):
        return self.persian_name


class Post(models.Model):
    date = models.DateTimeField(default=datetime.now, null=True, blank=True)
    date_str = models.CharField(default='۱۵ فروردین ۱۳۹۹', max_length=30, null=True, blank=True)
    title = models.CharField(default='عنوان', max_length=30, null=True, blank=True)
    full_description = models.TextField(default='', null=True, blank=True)
    short_description = models.CharField(max_length=255, default='', null=True, blank=True)
    div_element = models.TextField(default='', null=True, blank=True)
    cover = models.ImageField(upload_to='postCovers/', null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    author = models.CharField(max_length=20, default='مهندس جمشیدی', null=True, blank=True)
    status = models.IntegerField(default=Status.active.value, null=True, blank=True)

    @classmethod
    def get_posts(cls, fetch_num=20):
        posts = cls.objects.filter(status=Status.active.value).order_by('-date')[:fetch_num]
        posts_list = []
        for post in posts:
            posts_list.append({
                "date": post.date_str,
                "title": post.title,
                "fullDescription": post.full_description,
                "div": post.div_element,
                "cover": post.cover.url,
                "category": post.category.persian_name,
                "author": post.author,
                "shortDescription": post.short_description if post.short_description else (
                        post.full_description[:100] + '...')

            })
        return posts_list


class Program(models.Model):
    date = models.DateTimeField(default=datetime.now, null=True, blank=True)
    register_deadline = models.DateTimeField(default=datetime.now, null=True, blank=True)
    register_deadline_str = models.CharField(default='۱۵ فروردین ۱۳۹۹', max_length=30, null=True, blank=True)
    title = models.CharField(default='عنوان', max_length=30, null=True, blank=True)
    full_description = models.TextField(default='', null=True, blank=True)
    short_description = models.CharField(max_length=255, default='', null=True, blank=True)
    cover = models.ImageField(upload_to='programCover/', null=True, blank=True)
    banner = models.ImageField(upload_to='programBanner/', null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    register_link = models.CharField(max_length=255, default='', null=True, blank=True)
    instructor = models.CharField(max_length=20, default='مهندس جمشیدی', null=True, blank=True)
    status = models.IntegerField(default=Status.active.value, null=True, blank=True)

    @classmethod
    def get_programs(cls, fetch_num=20):
        programs = cls.objects.filter(status=Status.active.value, register_deadline__gt=datetime.now()).order_by(
            '-date')[:fetch_num]
        programs_list = []
        categories = {}
        for program in programs:
            program_category = program.category
            programs_list.append({
                "id": program.id,
                "cover": program.cover.url,
                "banner": program.banner.url,
                "registryLink": program.register_link,
                "instructor": program.instructor,
                "categories": [program_category.eng_name]
            })
            if program_category.eng_name not in categories:
                categories[program_category.eng_name] = program_category.persian_name
        return {
            "programs": programs_list,
            "categories": categories
        }


class Parameter(models.Model):
    name = models.CharField(default='', max_length=20, null=True, blank=True)
    key = models.IntegerField(default=0, null=True, blank=True)
    value = models.IntegerField(default=0, null=True, blank=True)

    @classmethod
    def raise_view_count(cls):
        try:
            parameter = cls.objects.get(key=ParameterKey.app_install_count.value)
            parameter.value = F('value') + 1
            parameter.save()
        except Exception as e:
            print(e)

    @classmethod
    def get_app_install_count(cls):
        return cls.objects.get(key=ParameterKey.app_install_count.value).value
