module Jekyll
  class ActionButtonTag < Liquid::Tag
    def initialize(tag_name, raw_args, tokens)
      args = Helpers.parse_args(raw_args)

      if args.length != 2
        raise "Expected 2 arguments. Got #{args.length}."
      end

      @link_src = args[1]
      @title = args[0]
      super
    end

    def render(context)
      "<div class='article-actions'><a class='button inline' href='#{@link_src}'>#{@title}</a></div>"
    end
  end
end

Liquid::Template.register_tag("actionbutton", Jekyll::ActionButtonTag)
