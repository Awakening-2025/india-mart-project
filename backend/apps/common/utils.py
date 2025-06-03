def generate_custom_id(prefix, model_class):
    objs = model_class.objects.filter(custom_id__startswith=prefix)
    ids = []
    for obj in objs:
        try:
            num = int(obj.custom_id.split('-')[1])
            ids.append(num)
        except (IndexError, ValueError):
            continue
    next_num = max(ids) + 1 if ids else 1
    return f"{prefix}-{next_num:03d}"