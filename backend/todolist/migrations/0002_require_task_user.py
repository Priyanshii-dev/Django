import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


def delete_tasks_without_owner(apps, schema_editor):
    Task = apps.get_model("todolist", "Task")
    Task.objects.filter(user__isnull=True).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("todolist", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RunPython(
            delete_tasks_without_owner,
            migrations.RunPython.noop,
        ),
        migrations.AlterField(
            model_name="task",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="tasks",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
