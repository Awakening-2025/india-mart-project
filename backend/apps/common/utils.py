def generate_custom_id(prefix, model_class):
    last_instance = model_class.objects.order_by('-id').first()
    if not last_instance or not hasattr(last_instance, 'custom_id'):
        return f"{prefix}-001"

    last_id = last_instance.custom_id.split("-")[-1]
    new_id = int(last_id) + 1
    return f"{prefix}-{new_id:03d}"
